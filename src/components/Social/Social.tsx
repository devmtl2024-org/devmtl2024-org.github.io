type SocialProps = {
  github: string | null;
  linkedin: string | null;
  website: string | null;
};

export default function Social({ github, linkedin, website }: SocialProps) {
  return (
    <div className="flex gap-4 mt-4">
      {github && (
        <a
          href={`https://github.com/${github}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-black hover:text-gray-300"
        >
          <i className="fab fa-github text-2xl"></i>
        </a>
      )}

      {linkedin && (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-black hover:text-gray-300"
        >
          <i className="fab fa-linkedin text-2xl"></i>
        </a>
      )}

      {website && (
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-black hover:text-gray-300"
        >
          <i className="fas fa-globe text-2xl"></i>
        </a>
      )}
    </div>
  );
}
