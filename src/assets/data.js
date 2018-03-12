var category = [{
  name: '大类1',
  code: '0001.',
  id: '001',
  open: true,
  children: [
    {
      name: '亚类1',
      code: '0001.0001.',
      id: '0011',
      children: [
        {
          name: '品类1',
          code: '0001.0001.0001.',
          id: '00111',
          children: [
            {
              name: '小类1',
              code: '0001.0001.0001.0001.',
              id: '0011111',
            }, {
              name: '小类2',
              code: '0001.0001.0001.0002.',
              id: '0011112',
            }
          ]
        }, {
          name: '品类2',
          code: '0001.0001.0002.',
          id: '00112',
          children: []
        }
      ]
    }, {
      name: '亚类2',
      code: '0001.0002.',
      id: '0012',
      children: []
    }
  ]
}, {
  name: '大类2',
  code: '0002.',
  id: '002',
  children: []
}]

var orgTree = [{
  'name':'集美区农业局',
  'code':'0001.0001.'
},{
  'name':'思明区农业局',
  'code':'0001.0002.'
}];

var comCategories = [{
  name: '工厂',
  code: '0001.'
}, {
  name: '超市',
  code: '0012.'
}];
var taskTree = {
  description: '测试任务'
  , taskNum: 2000
  , type: 'cy'
  , checkCategory: '0001.0001.0002.'
  , startDate: '2018-03-08'
  , endDate: '2018-03-09'
  , units: []
}
export {taskTree,category,orgTree,comCategories};
