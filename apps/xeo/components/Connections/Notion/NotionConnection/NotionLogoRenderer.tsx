/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import notionLogo from 'public/notion.png';
interface Props {
  iconString: string | undefined | null;
}

export const NotionLogoRenderer: React.FunctionComponent<Props> = ({
  iconString,
}) => {
  if (!iconString) {
    return (
      <div>
        <Image src={notionLogo} height={50} width={50} alt="Notion" />
      </div>
    );
  }

  if (iconString.startsWith('http')) {
    return (
      <div>
        <img src={iconString} alt="Notion logo" height={50} width={50} />
      </div>
    );
  }
  return <span className="text-5xl">{iconString}</span>;
};
