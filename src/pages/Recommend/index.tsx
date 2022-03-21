import React, { useEffect, useState } from 'react'
import { Tabs, message } from 'antd'
import './index.less'

import LeftBar from '../../components/LeftBar'

import { getRankings } from '../../api/recommend'

const { TabPane } = Tabs

interface rankItem {
  _id: string
  title: string
  shortTitle: string
}

interface rankingsObj {
  male: rankItem[]
  female: rankItem[]
  epub: rankItem[]
}

const Recommend: React.FC = () => {
  const [tabKey, setTabKey] = useState<string>('male')
  const [rankList, setRankingList] = useState<rankingsObj>()
  const [subRanks, setSubRanks] = useState<any>()
  const [activeRankId, setActiveRankID] = useState<string>('')

  const reqRankings = async () => {
    const res = await getRankings()
    if (res && res.status === 200 && res.data.ok) {
      const { data } = res
      setRankingList(data)
    } else {
      message.error('似乎出了一点问题...')
    }
  }

  useEffect(() => {
    reqRankings()
  }, [])

  useEffect(() => {
    if (rankList) {
      const item: rankItem[] = (rankList as any)[tabKey]
      const r: any = {}
      item.forEach((i) => {
        r[i._id] = i.shortTitle
      })
      setSubRanks(r)
      setActiveRankID(item[0]._id)
    }
  }, [rankList, tabKey])

  const handleClickRankItem = (key: string) => {
    setActiveRankID(key)
  }

  return (
    <div>
      <Tabs activeKey={tabKey} centered onChange={(key) => setTabKey(key)}>
        <TabPane tab="男生" key="male" />
        <TabPane tab="女生" key="female" />
        <TabPane tab="出版" key="epub" />
      </Tabs>

      <div style={{ height: 'calc(100vh - 106px)' }}>
        <LeftBar
          width={30}
          items={subRanks}
          current={activeRankId!}
          handleClickItem={handleClickRankItem}
        />
      </div>
    </div>
  );
};

export default Recommend
