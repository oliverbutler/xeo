import { ModalFooter } from '@xeo/ui/lib/Modal/Modal';
import { Footer } from 'components/Footer/Footer';
import { signOut } from 'next-auth/react';
import { Input } from '@xeo/ui/lib/Input/Input';
import { UserRole } from '@prisma/client';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { useForm } from 'react-hook-form';
import { SelectField } from '@xeo/ui/lib/Select/SelectField';
import { apiPost } from 'utils/api';
import { PostCreateUserRequest } from 'pages/api/user';
import { toast } from 'react-toastify';

type OnboardingForm = {
  name: string;
  role: UserRoleSelect;
};

export type UserRoleSelect = {
  label: string;
  value: UserRole;
};

const mapUserRoleToText = (role: UserRole): string => {
  switch (role) {
    case UserRole.DEVELOPER:
      return 'Developer';
    case UserRole.PROJECT_MANAGER:
      return 'Project Manager';
    case UserRole.TECH_LEAD:
      return 'Tech Lead';
  }
};

export const Onboarding: React.FunctionComponent = () => {
  const { me } = useCurrentUser();

  const roleOptions = Object.values(UserRole).map((role) => ({
    label: mapUserRoleToText(role),
    value: role,
  }));

  const { watch, register, control, handleSubmit } = useForm<OnboardingForm>({
    defaultValues: { name: me?.name || '' },
  });

  const currentName = watch('name') || me?.name;

  const onSubmit = async (data: OnboardingForm) => {
    const name = data.name || me?.name;

    if (!name) {
      toast.warn('Please enter a name');
      return;
    }

    const { error } = await apiPost<PostCreateUserRequest>('/api/user', {
      input: { preferredName: name, role: data.role.value },
    });

    if (error) {
      toast.error(error.body?.message ?? error.generic);
      return;
    }

    toast.success('Saved - Welcome to Xeo!');
    window.location.reload();
  };

  return (
    <div>
      <div className="flex items-center justify-center min-h-screen">
        <form
          className="bg-dark-100 dark:bg-dark-900 rounded-lg m-10 shadow-xl transition-all hover:shadow-2xl"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="p-6">
            <h1>Hey {currentName}, welcome to Xeo!</h1>
            <p>
              Before we get started, let's quickly get some information so we
              can tailor your experience!
            </p>
            <div className="space-y-4">
              <Input
                label="Preferred Name"
                placeholder="e.g. Olly"
                {...register('name', { required: true })}
              />
              <SelectField
                label="Role"
                options={roleOptions}
                control={control}
                name="role"
                rules={{ required: true }}
              />
            </div>
          </div>
          <ModalFooter
            primaryText="Continue"
            secondaryText="Go Back"
            clickSecondary={() => signOut()}
          />
        </form>
      </div>
      <Footer />
    </div>
  );
};
