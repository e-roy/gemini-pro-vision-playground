export const UlComponent: React.FC<React.HTMLAttributes<HTMLUListElement>> = ({
  children,
  ...props
}) => {
  return (
    <ul {...props} className="list-disc pl-4 mb-4">
      {children}
    </ul>
  );
};

export const OlComponent: React.FC<React.HTMLAttributes<HTMLOListElement>> = ({
  children,
  ...props
}) => {
  return (
    <ol {...props} className="list-decimal pl-4 mb-0">
      {children}
    </ol>
  );
};

export const LiComponent: React.FC<React.LiHTMLAttributes<HTMLLIElement>> = ({
  children,
  ...props
}) => {
  return (
    <li {...props} className="mb-1 leading-snug pl-4">
      {children}
    </li>
  );
};
