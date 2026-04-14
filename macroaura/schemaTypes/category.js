export default {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'order', title: 'Order', type: 'number' } // 👈 numeric field
  ],
  orderings: [
    {
      title: 'Order Asc',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }]
    },
    {
      title: 'Order Desc',
      name: 'orderDesc',
      by: [{ field: 'order', direction: 'desc' }]
    }
  ]
}