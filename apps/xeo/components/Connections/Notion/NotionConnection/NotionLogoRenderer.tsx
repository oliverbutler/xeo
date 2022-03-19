/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import notionLogo from 'public/notion.png';
interface Props {
  iconString: string | undefined | null;
  size?: number;
}

export const NotionLogoRenderer: React.FunctionComponent<Props> = ({
  iconString,
  size,
}) => {
  const renderSize = size || 50;
  if (!iconString) {
    return (
      <div>
        <Image
          src={notionLogo}
          height={renderSize}
          width={renderSize}
          alt="Notion"
        />
      </div>
    );
  }

  if (iconString.startsWith('http')) {
    return (
      <img
        className="select-none m-0"
        src={iconString}
        alt="Notion logo"
        height={renderSize}
        width={renderSize}
      />
    );
  }
  return <span className="text-4xl">{iconString}</span>;
};
