import {
  BookOpen,
  CheckCircle,
  Code,
  FileText,
  Flag,
  GitCompare,
  GitFork,
  GitMerge,
  GitPullRequest,
} from "lucide-react";

import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "~/components/ui/timeline";

const items = [
  {
    id: 1,
    date: "Just started",
    title: "Enrolled in Course",
    description:
      "You’ve successfully enrolled in the course. Let’s begin the journey!",
    icon: BookOpen, // Example icon, replace with your own
  },
  {
    id: 2,
    date: "10 minutes ago",
    title: "Completed First Lesson",
    description:
      "You completed the introduction module. You now understand the basics!",
    icon: CheckCircle, // Replace with relevant icon
  },
  {
    id: 3,
    date: "20 minutes ago",
    title: "Took a Quiz",
    description:
      "You attempted the quiz and scored 80%. Good job! Let’s keep going.",
    icon: FileText, // Or something quiz-related
  },
  {
    id: 4,
    date: "30 minutes ago",
    title: "Explored Advanced Topics",
    description:
      "You started exploring deeper concepts and applied them in exercises.",
    icon: Code, // Something techy or learning-deep
  },
  {
    id: 5,
    date: "45 minutes ago",
    title: "Completed the Course",
    description:
      "Congratulations! You’ve completed the course. Time to celebrate your progress!",
    icon: Flag, // Celebration icon
  },
];

const LearnJourney = () => {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold tracking-tighter">
        My Journey
      </h1>
      <p className="mb-8 text-sm text-muted-foreground">
        This is a timeline of my learning journey. It shows the steps I have
        taken to learn and grow in my career.
      </p>
      <Timeline defaultValue={3}>
        {items.map((item) => (
          <TimelineItem
            key={item.id}
            step={item.id}
            className="group-data-[orientation=vertical]/timeline:ms-10"
          >
            {item.icon === Flag ? (
              <div className="text-green-600">
                <TimelineHeader>
                  <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
                  <TimelineTitle className="mt-0.5">{item.title}</TimelineTitle>
                  <TimelineIndicator className="bg-primary/10 group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center border-none group-data-[orientation=vertical]/timeline:-left-7">
                    <item.icon size={14} />
                  </TimelineIndicator>
                </TimelineHeader>
                <TimelineContent className="text-green-600">
                  {item.description}
                  <TimelineDate className="mt-2 mb-0">{item.date}</TimelineDate>
                </TimelineContent>
              </div>
            ) : (
              <div>
                <TimelineHeader>
                  <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
                  <TimelineTitle className="mt-0.5">{item.title}</TimelineTitle>
                  <TimelineIndicator className="bg-primary/10 group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center border-none group-data-[orientation=vertical]/timeline:-left-7">
                    <item.icon size={14} />
                  </TimelineIndicator>
                </TimelineHeader>
                <TimelineContent>
                  {item.description}
                  <TimelineDate className="mt-2 mb-0">{item.date}</TimelineDate>
                </TimelineContent>
              </div>
            )}
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
};

export default LearnJourney;
