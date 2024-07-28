
export const PageHeader = (props: Props) => {
  const { title, Icon } = props;
  return (
    <div className="flex items-center gap-4">
      <div className="bg-primary p-3 rounded-xl">
        <Icon className="text-white" size={18} />
      </div>
      <span className="font-semibold text-lg">{title}</span>
    </div>
  );
};

type Props = {
  title: string;
  Icon: React.ElementType;
};
