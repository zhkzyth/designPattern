#!/usr/bin/env python
# encoding: utf-8


# 这个是观察者基类
class Subject(object):
    def __init__(self):
        self._observers = []

    # 添加依赖的对象
    def attach(self, observer):
        if not observer in self._observers:
            self._observers.append(observer)

    # 取消添加
    def detach(self, observer):
        try:
            self._observers.remove(observer)
        except ValueError:
            pass

    # 这里只是通知上面注册的依赖对象新的变化
    def notify(self, filter=None):
        for observer in self._observers:
            # 可以设置过滤条件，对不符合过滤条件的更新
            if filter != observer:
                observer.update(self)


# 观察者类
class Data(Subject):
    def __init__(self, name=''):
        super(Data, self).__init__()
        self.name = name
        self._data = 0

    # python2.6新增的写法,获取属性为property，设置属性为(假设属性名字为x)@x.setter,删除为@x.deleter
    @property
    def data(self):
        return self._data

    @data.setter
    def data(self, value):
        self._data = value
        self.notify()


# 这里有2个被观察者，也就是依赖的对象，每次Data有改变，这2个view都会变动
class HexViewer(object):
    def update(self, subject):
        print 'HexViewer: Subject %s has data 0x%x' % (subject.name, subject.data)


class DecimalViewer(object):
    def update(self, subject):
        print 'DecimalViewer: Subject %s has data %d' % (subject.name, subject.data)


if __name__ == '__main__':

    data1 = Data('Data 1')
    data2 = Data('Data 2')
    view1 = DecimalViewer()
    view2 = HexViewer()
    data1.attach(view1)
    data1.attach(view2)
    data2.attach(view2)
    data2.attach(view1)

    print "Setting Data 1 = 10"
    data1.data = 10
    print "Setting Data 2 = 15"
    data2.data = 15
    print "Setting Data 1 = 3"
    data1.data = 3
    print "Setting Data 2 = 5"
    data2.data = 5
    print "Update data1's view2 Because view1 is be filtered"
    data1.notify(filter=view1)
    print "Detach HexViewer from data1 and data2."
    data1.detach(view2)
    data2.detach(view2)
    print "Setting Data 1 = 10"
    data1.data = 10
    print "Setting Data 2 = 15"
    data2.data = 15
