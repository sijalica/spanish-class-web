export interface ChannelDef {
  id: string
  label: string
  path: string
  description: string
}

export interface ChannelGroup {
  title: string
  channels: ChannelDef[]
}

export const professorChannels: ChannelGroup[] = [
  {
    title: 'Studio',
    channels: [
      {
        id: 'home',
        label: 'welcome',
        path: '/professor',
        description: 'Overview of your tutoring studio',
      },
    ],
  },
  {
    title: 'People',
    channels: [
      {
        id: 'roster',
        label: 'roster',
        path: '/professor/roster',
        description: 'Connected students',
      },
      {
        id: 'notes',
        label: 'notes',
        path: '/professor/notes',
        description: 'Progress journal for a student',
      },
      {
        id: 'payments',
        label: 'payments',
        path: '/professor/payments',
        description: 'Manual payment tracking',
      },
    ],
  },
  {
    title: 'Teaching',
    channels: [
      {
        id: 'classes',
        label: 'classes',
        path: '/professor/classes',
        description: 'Schedule a class session',
      },
      {
        id: 'resources',
        label: 'resources',
        path: '/professor/resources',
        description: 'Sections and files for students',
      },
    ],
  },
]

export const studentChannels: ChannelGroup[] = [
  {
    title: 'Home',
    channels: [
      {
        id: 'home',
        label: 'welcome',
        path: '/student',
        description: 'Your learning space',
      },
      {
        id: 'progress',
        label: 'progress',
        path: '/student/progress',
        description: 'Points and homework stats',
      },
    ],
  },
  {
    title: 'Learning',
    channels: [
      {
        id: 'professors',
        label: 'professors',
        path: '/student/professors',
        description: 'Professors you are connected to',
      },
      {
        id: 'homework',
        label: 'homework',
        path: '/student/homework',
        description: 'Pending assignments',
      },
      {
        id: 'resources',
        label: 'resources',
        path: '/student/resources',
        description: 'Files shared by your professors',
      },
      {
        id: 'notes',
        label: 'notes',
        path: '/student/notes',
        description: 'Notes shared with you',
      },
    ],
  },
  {
    title: 'Account',
    channels: [
      {
        id: 'payments',
        label: 'payments',
        path: '/student/payments',
        description: 'Prepaid / payment status',
      },
    ],
  },
]

export function findChannel(
  groups: ChannelGroup[],
  pathname: string,
): ChannelDef | undefined {
  const flat = groups.flatMap((g) => g.channels)
  return (
    flat.find((c) => c.path === pathname) ??
    flat.find((c) => c.path !== flat[0]?.path && pathname.startsWith(c.path + '/')) ??
    flat[0]
  )
}
