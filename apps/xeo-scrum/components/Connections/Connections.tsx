import Image from 'next/image';
import notionLogo from 'public/notion-logo.jpeg';
import linearLogo from 'public/linear-app.png';
import { Button, ButtonVariation } from '@xeo/ui';
import classNames from 'classnames';

interface Connection {
  name: string;
  image: StaticImageData;
  content: React.ReactNode;
  disabled?: boolean;
  link?: string;
}

const CONNECTIONS: Connection[] = [
  {
    name: 'Notion',
    image: notionLogo,
    link: 'notion',
    content: (
      <ul>
        <li>Burn Down Chart</li>
        <li>Sprint Planning</li>
        <li>View Sprint Backlog</li>
      </ul>
    ),
  },
  {
    name: 'Linear',
    image: linearLogo,
    content: (
      <p>
        Linear integration planned for a future release, if there is suitable
        demand.
      </p>
    ),
    disabled: true,
  },
];

export const Connections: React.FunctionComponent = () => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {CONNECTIONS.map((connection) => (
        <div
          className={classNames(
            'bg-dark-800 rounded-lg transition-all',
            {
              'opacity-40 grayscale': connection.disabled,
            },
            {
              'ring-dark-700 ring-0 hover:shadow-2xl hover:ring-2':
                !connection.disabled,
            }
          )}
          key={connection.name}
        >
          <div style={{ height: 250, position: 'relative' }}>
            <Image
              src={connection.image}
              alt="Notion Logo"
              layout="fill"
              objectFit="cover"
              className="select-none rounded-t-lg"
            />
          </div>
          <div className="flex h-72 flex-col px-4">
            <h2 className="mt-6 mb-2">{connection.name}</h2>
            <div className="flex-grow">{connection.content}</div>
            <div className="mx-auto py-4 pb-6">
              <Button
                href={`/connections/${connection.link}`}
                disabled={connection.disabled}
                variation={ButtonVariation.Secondary}
              >
                Connect to {connection.name}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
