type DashboardSectionPageProps = {
  title: string;
  description?: string;
};

const DashboardSectionPage = ({ title, description }: DashboardSectionPageProps) => {
  return (
    <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
      {description && (
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      )}
    </div>
  );
};

export default DashboardSectionPage;
