import {
  ImageUploader,
  MultiImageUploader,
  NumberField,
  SelectField,
  SkillsField,
  SwitchField,
  TextAreaField,
  TextField,
} from "@/components/admin/fields";
import {
  saveAchievement,
  saveActivity,
  saveEducation,
  saveHobby,
  saveMetric,
  saveProject,
  saveSkill,
} from "@/app/admin/actions";
import type {
  Achievement,
  Activity,
  Education,
  Hobby,
  Metric,
  Project,
  SkillCategory,
} from "@/types/content";

export function ProjectForm({ project }: { project?: Project }) {
  return (
    <form action={saveProject} className="space-y-4">
      {project?.id && <input type="hidden" name="id" value={project.id} />}
      <TextField label="Name" name="name" defaultValue={project?.name} required />
      <TextAreaField label="Short Details" name="short_details" defaultValue={project?.short_details} />
      <div className="grid grid-cols-2 gap-4">
        <TextField label="GitHub URL" name="github_url" defaultValue={project?.github_url} />
        <TextField label="Live URL" name="live_url" defaultValue={project?.live_url} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Client"
          name="client"
          defaultValue={project?.client}
          options={[
            { value: "web", label: "Web" },
            { value: "mobile", label: "Mobile" },
          ]}
        />
        <NumberField label="Order" name="order" defaultValue={project?.order} />
      </div>
      <TextField
        label="Technologies (comma separated)"
        name="technologies"
        defaultValue={project?.technologies?.join(", ")}
        placeholder="Flutter, Dart, FastAPI"
      />
      <MultiImageUploader
        label="Project Images"
        name="images"
        bucket="portfolio-media"
        defaultValue={project?.images ?? (project?.image ? [project.image] : [])}
      />
      <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors">
        {project ? "Update Project" : "Create Project"}
      </button>
    </form>
  );
}

export function AchievementForm({ achievement }: { achievement?: Achievement }) {
  return (
    <form action={saveAchievement} className="space-y-4">
      {achievement?.id && <input type="hidden" name="id" value={achievement.id} />}
      <TextField label="Title" name="title" defaultValue={achievement?.title} required />
      <TextAreaField label="Award" name="award" defaultValue={achievement?.award} required />
      <SelectField
        label="Award Rank"
        name="award_rank"
        defaultValue={achievement?.award_rank}
        options={[
          { value: "champion", label: "Champion" },
          { value: "1st-runner-up", label: "1st Runner-Up" },
          { value: "2nd-runner-up", label: "2nd Runner-Up" },
          { value: "other", label: "Other" },
        ]}
      />
      <div className="grid grid-cols-3 gap-4">
        <TextField label="Date" name="date" defaultValue={achievement?.date} />
        <TextField label="Project" name="project" defaultValue={achievement?.project} />
        <TextField label="Team" name="team" defaultValue={achievement?.team} />
      </div>
      <ImageUploader label="Image" name="image" bucket="portfolio-media" defaultValue={achievement?.image} />
      <NumberField label="Order" name="order" defaultValue={achievement?.order} />
      <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors">
        {achievement ? "Update Achievement" : "Create Achievement"}
      </button>
    </form>
  );
}

export function ActivityForm({ activity }: { activity?: Activity }) {
  return (
    <form action={saveActivity} className="space-y-4">
      {activity?.id && <input type="hidden" name="id" value={activity.id} />}
      <TextField label="Title" name="title" defaultValue={activity?.title} required />
      <TextField label="Organization" name="organization" defaultValue={activity?.organization} />
      <TextField label="Period" name="period" defaultValue={activity?.period} />
      <SwitchField label="Active (current)" name="active" defaultChecked={activity?.active} />
      <NumberField label="Order" name="order" defaultValue={activity?.order} />
      <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors">
        {activity ? "Update Activity" : "Create Activity"}
      </button>
    </form>
  );
}

export function EducationForm({ education }: { education?: Education }) {
  return (
    <form action={saveEducation} className="space-y-4">
      {education?.id && <input type="hidden" name="id" value={education.id} />}
      <TextField label="Degree" name="degree" defaultValue={education?.degree} required />
      <TextField label="Institution" name="institution" defaultValue={education?.institution} />
      <TextField label="Period" name="period" defaultValue={education?.period} />
      <TextAreaField label="Description" name="description" defaultValue={education?.description} />
      <SelectField
        label="Status"
        name="status"
        defaultValue={education?.status}
        options={[
          { value: "current", label: "Current" },
          { value: "completed", label: "Completed" },
        ]}
      />
      <NumberField label="Order" name="order" defaultValue={education?.order} />
      <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors">
        {education ? "Update Education" : "Create Education"}
      </button>
    </form>
  );
}

export function SkillForm({ skill }: { skill?: SkillCategory }) {
  return (
    <form action={saveSkill} className="space-y-4">
      {skill?.id && <input type="hidden" name="id" value={skill.id} />}
      <TextField label="Category" name="category" defaultValue={skill?.category} required />
      <TextField label="Icon key" name="icon" defaultValue={skill?.icon} placeholder="FaMobile / Server / Globe" />
      <SkillsField name="skills_json" defaultValue={skill?.skills} />
      <NumberField label="Order" name="order" defaultValue={skill?.order} />
      <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors">
        {skill ? "Update Skill" : "Create Skill"}
      </button>
    </form>
  );
}

export function HobbyForm({ hobby }: { hobby?: Hobby }) {
  return (
    <form action={saveHobby} className="space-y-4">
      {hobby?.id && <input type="hidden" name="id" value={hobby.id} />}
      <TextField label="Title" name="title" defaultValue={hobby?.title} required />
      <TextAreaField label="Description" name="description" defaultValue={hobby?.description} />
      <TextField label="Icon key" name="icon" defaultValue={hobby?.icon} placeholder="MdSportsSoccer" />
      <NumberField label="Order" name="order" defaultValue={hobby?.order} />
      <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors">
        {hobby ? "Update Hobby" : "Create Hobby"}
      </button>
    </form>
  );
}

export function MetricForm({ metric }: { metric?: Metric }) {
  return (
    <form action={saveMetric} className="space-y-4">
      {metric?.id && <input type="hidden" name="id" value={metric.id} />}
      <TextField label="Label" name="label" defaultValue={metric?.label} required />
      <div className="grid grid-cols-2 gap-4">
        <NumberField label="Value" name="value" defaultValue={metric?.value} required />
        <TextField label="Suffix" name="suffix" defaultValue={metric?.suffix} placeholder="+ / + yrs" />
      </div>
      <TextField label="Icon key" name="icon" defaultValue={metric?.icon} placeholder="Smartphone / Trophy / Crown / Users" />
      <SwitchField label="Featured (large card)" name="featured" defaultChecked={metric?.featured} />
      <NumberField label="Order" name="order" defaultValue={metric?.order} />
      <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors">
        {metric ? "Update Metric" : "Create Metric"}
      </button>
    </form>
  );
}
