import { collection, doc, getDoc, getDocs, query, setDoc, where, orderBy } from 'firebase/firestore'
import { db } from './firebase'
import type { Visitor, Visit } from '../types/models'

const VISITORS = 'visitors'
const VISITS = 'visits'
const FIELDS = 'fields' 

export async function createOrUpdateVisitor(v: Visitor) {
  await setDoc(doc(db, VISITORS, v.id), v)
  return v
}

export async function getVisitorByQR(qrId: string) {
  const q = query(collection(db, VISITORS), where('qrId', '==', qrId))
  const snap = await getDocs(q)
  return snap.empty ? null : (snap.docs[0].data() as Visitor)
}

export async function getVisitor(id: string) {
  const snap = await getDoc(doc(db, VISITORS, id))
  return snap.exists() ? (snap.data() as Visitor) : null
}

export async function listVisitors() {
  const snap = await getDocs(query(collection(db, VISITORS), orderBy('createdAt', 'desc')))
  return snap.docs.map(d => d.data() as Visitor)
}

export async function addVisit(visitorId: string) {
  const visit: Visit = {
    id: crypto.randomUUID(),
    visitorId,
    ts: Date.now(),
  }
  await setDoc(doc(db, VISITS, visit.id), visit)
  return visit
}

export async function listVisits(range?: { from?: number; to?: number }, nameFilter?: string) {
  const snap = await getDocs(collection(db, VISITS))
  const visits: Visit[] = snap.docs.map(d => d.data() as Visit)

  const visitors = await listVisitors()
  const byId = new Map(visitors.map(v => [v.id, v]))

  let filtered = visits
  if (range?.from) filtered = filtered.filter(v => v.ts >= range.from!)
  if (range?.to) filtered = filtered.filter(v => v.ts <= range.to!)
  if (nameFilter) {
    const nf = nameFilter.toLowerCase().trim()
    filtered = filtered.filter(v => {
      const vis = byId.get(v.visitorId)
      if (!vis) return false
      const full = `${vis.firstName} ${vis.lastName}`.toLowerCase()
      return full.includes(nf)
    })
  }
  return filtered.map(v => ({ ...v, visitor: byId.get(v.visitorId) })) as any
}

export async function getDynamicFields() {
  const snap = await getDocs(collection(db, FIELDS))
  return snap.docs.map(d => d.data()) as any[]
}

export async function setDynamicFields(fields: any[]) {
  // Guardamos un único doc fijo (simple) con los campos
  await setDoc(doc(db, FIELDS, 'definition'), { fields })
}

export async function getFieldDefinition() {
  const snap = await getDoc(doc(db, FIELDS, 'definition'))
  return snap.exists() ? (snap.data().fields as any[]) : []
}