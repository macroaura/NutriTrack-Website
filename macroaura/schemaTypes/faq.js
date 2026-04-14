export default {
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    { name: 'question', title: 'Question', type: 'string' },
    { name: 'answer', title: 'Answer', type: 'array', of: [{ type: 'block' }] }, // Portable Text
    { name: 'tag', title: 'Tag', type: 'array', of: [{ type: 'string' }] },
    { name: 'category', title: 'Category', type: 'reference', to: [{ type: 'category' }] },
    { name: 'order', title: 'Order', type: 'number', description: 'Lower=shown first' }
  ],
  orderings: [
    { title: 'Order asc', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }
  ]
}