module.exports = {
  types: [
    { value: 'feat', name: '新功能' },
    { value: 'fix', name: '修复' },
    { value: 'docs', name: '文档变更' },
    { value: 'refactor', name: '重构' },
    { value: 'perf', name: '优化' },
    { value: 'test', name: '增加测试' },
    { value: 'chore', name: '脚手架变动' },
  ],
  messages: {
    type: '请选择提交类型',
    subject: '请简要描述提交',
    body: '请输入详细描述(可选)',
    confirmCommit: '确认使用以上信息提交? (y/n)'
  },
  skipQuestions: ['scope', 'body', 'footer'],
};
