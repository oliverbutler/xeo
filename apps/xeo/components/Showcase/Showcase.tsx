import classNames from 'classnames';
import Image from 'next/image';
import xeoTemplate from 'public/xeo-template.png';
import xeoTemplateDark from 'public/xeo-template-dark.png';
import xeoCapacity from 'public/xeo-capacity.png';
import xeoCapacityDark from 'public/xeo-capacity-dark.png';
import xeoDep from 'public/xeo-dep.png';
import xeoDepDark from 'public/xeo-dep-dark.png';
import xeoTeam from 'public/xeo-team.png';
import xeoTeamDark from 'public/xeo-team-dark.png';
import xeoBdc from 'public/xeo-bdc.png';
import xeoBdcDark from 'public/xeo-bdc-dark.png';
import { Content } from 'components/Content';
import { Button, ButtonColour } from '@xeo/ui/lib/Button/Button';
import { InlineBadge } from 'components/Badge/Badge';
import { useTheme } from 'next-themes';

export const Showcase: React.FunctionComponent = () => {
  const nextTheme = useTheme();

  const isDarkTheme = nextTheme.theme === 'dark';

  return (
    <Content>
      <div className="py-24">
        <div
          className={classNames(
            'flex  mt-0 items-center gap-24 text-center md:text-left flex-col-reverse md:flex-row'
          )}
        >
          <div className="flex flex-col">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r to-secondary-400 from-primary-400 rounded-lg blur-2xl opacity-30"></div>
              <Image
                className="shadow-lg rounded-lg"
                src={isDarkTheme ? xeoBdcDark : xeoBdc}
                alt="Xeo Home Screen"
                placeholder="blur"
              />
            </div>
          </div>
          <div className="flex flex-col w-full justify-center overflow-y-hidden my-8 md:my-16">
            <h1 className="my-4">Monitor and React to Problems</h1>
            <p className="">
              Xeo automatically generates an interactive Burn Down Chart which
              is a visual representation of the teams progress.
            </p>
            <p>
              Each day, teams can then discuss their progress, and react to
              delays by solving problems and unblocking dependencies
            </p>
          </div>
        </div>
      </div>

      <div className="py-24">
        <div
          className={classNames(
            'flex  mt-0 items-center gap-24 text-center md:text-left flex-col md:flex-row'
          )}
        >
          <div className="flex flex-col w-full justify-center overflow-y-hidden my-8 md:my-16">
            <h1 className="my-4">Adapts to your Team</h1>
            <p className="">
              S*** happens, we get it. So we made Xeo flexible enough to adjust
              to your agile scrum team - you are able to adjust the speed of
              each developer every day, and see this affect your burn down
              chart.
            </p>
          </div>
          <div className="flex flex-col">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r to-secondary-400 from-primary-400 rounded-lg blur-2xl opacity-30"></div>
              <Image
                className="shadow-lg rounded-lg"
                src={isDarkTheme ? xeoCapacityDark : xeoCapacity}
                alt="Xeo Capacity SCreen"
                placeholder="blur"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="py-24">
        <div
          className={classNames(
            'flex  mt-0 items-center gap-24 text-center md:text-left flex-col-reverse md:flex-row'
          )}
        >
          <div className="flex flex-col">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r to-secondary-400 from-primary-400 rounded-lg blur-2xl opacity-30"></div>
              <Image
                className="shadow-lg rounded-lg"
                src={isDarkTheme ? xeoDepDark : xeoDep}
                alt="Xeo Home Screen"
                placeholder="blur"
              />
            </div>
          </div>
          <div className="flex flex-col w-full justify-center overflow-y-hidden my-8 md:my-16">
            <h1 className="my-4">Dependency Graphs</h1>
            <p className="">
              A recurring issue some teams face is tracking ticket dependencies,
              with Xeo we let you automate the process in a visual pleasing way.
            </p>
            <p>
              During planning your team can analyse the dependencies of tickets,
              ensuring that there are enough parallel tracks of work for the
              developers.
            </p>
          </div>
        </div>
      </div>
      <div className="py-24">
        <div
          className={classNames(
            'flex  mt-0 items-center gap-24 text-center md:text-left flex-col md:flex-row'
          )}
        >
          <div className="flex flex-col w-full justify-center overflow-y-hidden my-8 md:my-16">
            <h1 className="my-4">All Teams Welcome</h1>

            <p>
              Xeo and the provided template give a great starting point for
              teams wishing to utilise agile principles to improve productivity
              and reduce waste and risk.
            </p>
            <p>
              If you're new to Scrum I'd recommend reading the{' '}
              <a href="https://www.scrum.org/resources/scrum-guide">
                Scrum Guide{' '}
              </a>{' '}
              and reading below about the other tools you can utilise.
            </p>
          </div>
          <div className="flex flex-col">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r to-secondary-400 from-primary-400 rounded-lg blur-2xl opacity-30"></div>
              <Image
                className="shadow-lg rounded-lg"
                src={isDarkTheme ? xeoTeamDark : xeoTeam}
                alt="Xeo Team Members"
                placeholder="blur"
              />
            </div>
          </div>
        </div>
      </div>

      <hr />

      <div className="flex flex-col items-center mt-24">
        <h1>Comparing Jira, Trello, and Xeo</h1>
        <p className="text-center">
          I've used lots of Scrum tools, some I've loved, some I've hated. Below
          is a summary table of the gap Xeo fills in the battle between Jira,
          Trello, and Notion as agile Scrum tools.
        </p>

        <div className="max-w-full overflow-x-auto">
          <table className="my-12">
            <thead>
              <tr>
                <th></th>
                <th className="text-2xl">Jira</th>
                <th className="text-2xl">Trello</th>
                <th className="text-2xl">Notion</th>
                <th className="text-2xl">Xeo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Basic Down Charts</td>
                <td>✅</td>
                <td>❌</td>
                <td>❌</td>
                <td>🌟</td>
              </tr>
              <tr>
                <td>Advanced Burn Down Chart</td>
                <td>❌</td>
                <td>❌</td>
                <td>❌</td>
                <td>🌟</td>
              </tr>
              <tr>
                <td>Team Documentation</td>
                <td>❌</td>
                <td>❌</td>
                <td>🌟</td>
                <td>🌟</td>
              </tr>
              <tr>
                <td>Team Customisation</td>
                <td>✅</td>
                <td>❌</td>
                <td>🌟</td>
                <td>🌟</td>
              </tr>
              <tr>
                <td>Sprint/Capacity Planning</td>
                <td>✅</td>
                <td>❌</td>
                <td>❌</td>
                <td>🌟</td>
              </tr>
              <tr>
                <td>Dependency Visualization</td>
                <td>❌</td>
                <td>❌</td>
                <td>❌</td>
                <td>🌟</td>
              </tr>
              <tr>
                <td>Extensions/ Integrations</td>
                <td>✅</td>
                <td>✅</td>
                <td>✅</td>
                <td>✅</td>
              </tr>
              <tr>
                <td>Project Visibility</td>
                <td>✅</td>
                <td>❌</td>
                <td>✅</td>
                <td>✅</td>
              </tr>
              <tr>
                <td>User Interface</td>
                <td>❌</td>
                <td>✅</td>
                <td>✅</td>
                <td>✅</td>
              </tr>
              <tr>
                <td>Self Hostable</td>
                <td>✅</td>
                <td>❌</td>
                <td>❌</td>
                <td>❌</td>
              </tr>
            </tbody>
          </table>
          <p className="text-sm text-dark-800 dark:text-dark-500 ">
            This table is my own opinions having used all tools (as of March
            2022)
          </p>
        </div>
      </div>

      <hr />

      <div className="flex flex-col items-center mt-24">
        <h1 id="read-more">
          Get the Notion Template <InlineBadge variant="success" text="Free" />
        </h1>
        <p className="text-center">
          At Xeo we believe good templates should be available to everyone,
          we've designed a starter agile Scrum template to get your teams
          started with Notion Project boards, while giving advanced features and
          giving all product stakeholders visibility.
        </p>
        <p>
          Some features of the template are as follows:{' '}
          <b>Sprint/Kanban View</b>, <b>Backlog View</b>,{' '}
          <b>Technical and Backlog Refinement Views</b>, <b>Milestones</b>,{' '}
          <b>Epics</b>, <b>Sprint Planning Views</b>.
        </p>

        <Button
          href="https://xeo.sh/template"
          className="my-12"
          variation="tertiary"
          colour={ButtonColour.Secondary}
        >
          Get the Template
        </Button>
        <div className="flex flex-col items-center">
          <div className="relative sm:w-2/3">
            <div className="absolute -inset-1 bg-secondary-500 rounded-lg blur-2xl opacity-40"></div>
            <Image
              className="shadow-lg rounded-lg"
              src={isDarkTheme ? xeoTemplateDark : xeoTemplate}
              alt="Xeo Notion Template"
              placeholder="blur"
            />
          </div>
        </div>
      </div>

      <hr />

      <div className="flex flex-col items-center mt-24">
        <h1>
          Pricing <InlineBadge variant="warning" text="Beta" />
        </h1>
        <p className="text-center">
          Xeo is currently in beta, everything is free! All the features you see
          are likely to change as time goes on. My goal is to support the
          project with advanced enterprise features while keeping the main
          project free and accessible.
        </p>
      </div>

      <hr />

      <div className="flex flex-col items-center my-24">
        <h1>Convinced Yet?</h1>
        <p className="text-center">
          We've used Xeo on 25+ teams across 3+ companies so far, this is a
          product we're proud of and hopefully it will help your team. If you're
          interested in using Xeo, please get get started or get in touch with
          me.
        </p>
        <Button
          className="mx-auto "
          href="/login"
          colour={ButtonColour.Secondary}
        >
          Get Started
        </Button>
      </div>
    </Content>
  );
};
