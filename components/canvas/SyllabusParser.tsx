import { Card } from "../ui/Card";
import { BodyText } from "../ui/BodyText";

export function SyllabusParser({ courses }: { courses: string[] }) {
  return (
    <Card>
      <BodyText className="mb-md text-text-primary">Reading your syllabi...</BodyText>
      <div className="space-y-xs">
        {courses.map((course) => (
          <BodyText key={course}>{course}</BodyText>
        ))}
      </div>
      <BodyText className="mt-md text-accent-primary">Found 3 hidden deadlines not in Canvas.</BodyText>
    </Card>
  );
}
