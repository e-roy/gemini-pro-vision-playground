// components/markdown-viewer/table.tsx
export const TableComponent: React.FC<
  React.TableHTMLAttributes<HTMLTableElement>
> = ({ children, ...props }) => {
  return (
    <div className="w-full max-w-[340px] sm:max-w-[640px] md:max-w-full overflow-x-auto">
      <table
        {...props}
        className="w-full my-4 divide-y divide-primary/60 border border-primary/30 border-collapse p-1 bg-primary/10"
      >
        {children}
      </table>
    </div>
  );
};

export const TheadComponent: React.FC<
  React.HTMLAttributes<HTMLTableSectionElement>
> = ({ children, ...props }) => {
  return (
    <thead {...props} className="divide-x bg-primary/10">
      {children}
    </thead>
  );
};

export const TbodyComponent: React.FC<
  React.HTMLAttributes<HTMLTableSectionElement>
> = ({ children, ...props }) => {
  return (
    <tbody {...props} className="divide-y divide-x">
      {children}
    </tbody>
  );
};

export const TrComponent: React.FC<
  React.HTMLAttributes<HTMLTableRowElement>
> = ({ children, ...props }) => {
  return <tr {...props}>{children}</tr>;
};

export const ThComponent: React.FC<
  React.ThHTMLAttributes<HTMLTableCellElement>
> = ({ children, ...props }) => {
  return (
    <th
      {...props}
      className={`px-6 py-3 text-left text-sm font-bold text-primary/90 uppercase border-x border-x-primary/10`}
    >
      {children}
    </th>
  );
};

export const TdComponent: React.FC<
  React.TdHTMLAttributes<HTMLTableCellElement>
> = ({ children, ...props }) => {
  return (
    <td
      {...props}
      className="px-6 py-2 text-sm whitespace-nowrap border-x-primary/10 border-y-primary/50 border"
    >
      {children}
    </td>
  );
};
