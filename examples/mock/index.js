
import Mock from 'mockjs';

const data={
    'id':'@guid',
    'name':'@cname'
};

Mock.mock('/api/test', 'post', data);

