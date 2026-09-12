// ABINITIA — Core Types
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: Date
}

export interface Family {
  id: string
  name: string
  surname: string
  description?: string
  origin?: string
  symbol?: string
  motto?: string
  isPublic: boolean
  adminId: string
  createdAt: Date
  stats?: FamilyStats
}

export interface FamilyStats {
  people: number
  generations: number
  stories: number
  documents: number
  photos: number
  audios: number
  events: number
  bookProgress: number // percentage 0-100
  pendingInvestigations: number
  newCollaborators: number
}

export interface Person {
  id: string
  familyId: string
  firstName: string
  lastName?: string
  aliases?: string[]
  birthDate?: string
  birthPlace?: string
  deathDate?: string
  deathPlace?: string
  gender?: 'M' | 'F' | 'O' | null
  occupation?: string
  nationality?: string
  notes?: string
  userId?: string  // if associated to a platform user
  photos?: string[]
  evidenceStatus?: EvidenceStatus
  createdById: string
  createdAt: Date
  updatedAt: Date
}

export type EvidenceStatus = 'CONFIRMED' | 'REPORTED' | 'INFERRED' | 'UNCONFIRMED' | 'INVESTIGATING'

export interface Relationship {
  id: string
  personAId: string
  personBId: string
  type: RelationshipType
  evidenceStatus?: EvidenceStatus
  notes?: string
}

export type RelationshipType =
  | 'PARENT_CHILD'
  | 'SPOUSE'
  | 'SIBLING'
  | 'ADOPTED'

export interface TreeNode {
  person: Person
  x: number
  y: number
  generation: number
  branchId?: string
  children: string[]  // person IDs
  parents: string[]   // person IDs
  partners: string[]  // person IDs
}

export interface TreeEdge {
  from: string
  to: string
  type: RelationshipType
}

export interface Story {
  id: string
  familyId: string
  title: string
  content: string
  originalContent?: string   // raw transcription
  authorId: string
  associatedPersonIds: string[]
  associatedEventIds?: string[]
  audioUrl?: string
  transcription?: string
  visibility: 'PRIVATE' | 'FAMILY' | 'BOOK'
  evidenceStatus: EvidenceStatus
  createdAt: Date
}

export interface TimelineEvent {
  id: string
  familyId: string
  title: string
  description?: string
  date?: string
  dateApprox?: 'YEAR' | 'DECADE' | 'CENTURY' | 'BEFORE' | 'AFTER' | 'UNKNOWN'
  type: EventType
  personIds?: string[]
  location?: string
  evidenceStatus: EvidenceStatus
  isHistoricalContext?: boolean
}

export type EventType =
  | 'BIRTH' | 'DEATH' | 'MARRIAGE' | 'DIVORCE'
  | 'MIGRATION' | 'MOVE' | 'EDUCATION'
  | 'PROFESSION' | 'FAMILY_EVENT' | 'HISTORICAL'

export interface Invitation {
  id: string
  familyId: string
  code: string
  createdById: string
  targetPersonId?: string
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED'
  expiresAt: Date
  createdAt: Date
}

export interface JoinRequest {
  id: string
  familyId: string
  userId: string
  userName: string
  userEmail: string
  targetPersonId: string
  message?: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: Date
}

export interface BookChapter {
  id: string
  familyId: string
  title: string
  content: string
  order: number
  generationFrom?: number
  generationTo?: number
  branchId?: string
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED'
  storyIds: string[]
}

export interface AgentMessage {
  id: string
  role: 'agent' | 'user' | 'system'
  content: string
  timestamp: Date
  audioUrl?: string
  extractedData?: ExtractedData
}

export interface ExtractedData {
  persons?: Partial<Person>[]
  events?: Partial<TimelineEvent>[]
  relationships?: Partial<Relationship>[]
  facts?: string[]
}

export type Role = 'ADMIN' | 'EDITOR' | 'CONTRIBUTOR' | 'PARTICIPANT' | 'READER'

export interface FamilyMember {
  userId: string
  familyId: string
  personId?: string
  role: Role
  joinedAt: Date
}
