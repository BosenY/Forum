﻿import * as React from 'react';
import * as State from '../../States/AppState';
import * as Utility from '../../Utility';
import * as $ from 'jquery';
import {
    BrowserRouter as Router,
    Route,
    Link,

    withRouter
} from 'react-router-dom';
import * as Redux from 'redux';
import { UbbEditor } from '../UbbEditor';
import { RouteComponent } from '../RouteComponent';
import { UbbContainer } from '.././UbbContainer';
import { Replier } from './Topic-Replier';
import { ReplyContent } from './Topic-ReplyContent';
import { Provider } from 'react-redux';
import { AwardInfo } from './Topic-AwardInfo';
import { SendTopic } from './Topic-SendTopic';
import { Category } from './Topic-Category';
import { Pager } from '../Pager';
import { Reply } from './Topic-Reply';
import { NotFoundTopic, UnauthorizedTopic, ServerError } from '../Status';
import { TopicInfo } from './Topic-TopicInfo';
import { FindIP } from '../FindIP';
import { Constants } from '../Constant';
import { NoticeMessage } from '../NoticeMessage';
import  DocumentTitle  from '../DocumentTitle';
declare let moment: any;
declare let editormd: any;


export class Post extends RouteComponent<{history}, { topicid, page, totalPage, userName, boardId, topicInfo, boardInfo, fetchState, quote, shouldRender,isFav ,IPData}, { topicid, page, userName }> {
    constructor(props, context) {
        super(props, context);
        this.update = this.update.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.quote = this.quote.bind(this);
        this.state = {
            page: 1, shouldRender: true, topicid: this.match.params.topicid, totalPage: 1, userName: null, boardId: 7, topicInfo: { replyCount: 0 }, boardInfo: { masters: [], id: 7 }, fetchState: 'ok', quote: "", isFav: false, IPData:[]
        };
    }
    quote(content, userName, replyTime, floor, postId) {
    
        const y = $("#sendTopicInfo").offset().top;
        let page = this.state.page;
        if (!this.state.page) page = 1;
        const url = `/topic/${this.state.topicid}/${page}#sendTopicInfo`;
        this.props.history.push(url);
        this.setState({ quote: { content: content, userName: userName, replyTime: replyTime, floor: floor, postId: postId } });
    }
    update() {
       
        this.setState({});
    }
    async handleChange() {
        let page: number;
        if (!this.match.params.page) {
            page = 1;
        } else {
            page = parseInt(this.match.params.page);
        }
        const topicInfo = await Utility.getTopicInfo(this.match.params.topicid);
        const newPage = (topicInfo.replyCount+1) % 10 === 0 ? (topicInfo.replyCount+1) / 10 : ((topicInfo.replyCount+1) - (topicInfo.replyCount+1) % 10) / 10 + 1;  
        const totalPage = await this.getTotalPage(topicInfo.replyCount);
        const userName = this.match.params.userName;
        const floor = (topicInfo.replyCount + 1) % 10;
        //检查用户是否设置跳转到最新回复
        let noticeSetting = Utility.getLocalStorage("noticeSetting");
        if (page != newPage) {
            if ((noticeSetting && noticeSetting.post === "是") || ((newPage == page + 1) && (floor == 1))) {
                page = newPage;
                let url = `/topic/${topicInfo.id}/${page}#${floor}`;
                this.setState({ quote: { userName: "", content: "", replyTime: "", floor: "" } });
                this.props.history.push(url);
            }
            else {
                let url = `/topic/${topicInfo.id}/${page}`; 
                //如果是引用了某一层楼，发帖后应该跳转回这层楼
                if (this.state.quote && this.state.quote.floor) {
                    let quoteFloor = this.state.quote.floor % 10;
                    url = `/topic/${topicInfo.id}/${page}#${quoteFloor}`;
                }
                else {
                    $('.footerRow')[0].scrollIntoView(true);
                }
                this.setState({ quote: { userName: "", content: "", replyTime: "", floor: "" } });
                this.props.history.push(url);
            }
        }
        else {
            page = newPage;
            let url = `/topic/${topicInfo.id}/${page}#${floor}`;
            this.setState({ quote: { userName: "", content: "", replyTime: "", floor: "" } });
            this.props.history.push(url);
        }
        //回复成功提示
        Utility.noticeMessageShow('replyMessage');
        const isFav = await Utility.getFavState(this.match.params.topicid);
        this.setState({ topicInfo: topicInfo, quote: { userName: "", content: "", replyTime: "", floor: "" },isFav:isFav}); 
        //更新一下未读消息数目
        Utility.refreshHoverUnReadCount();
    }
    async componentWillReceiveProps(newProps) {
        //page 是否变了
        let page: number;
        if (!newProps.match.params.page) {
            page = 1;
        }
        else { page = parseInt(newProps.match.params.page); }
        const userName = newProps.match.params.userName;
        const topicInfo = await Utility.getTopicInfo(newProps.match.params.topicid);
        const boardId = topicInfo.boardId;
        const boardInfo = await Utility.getBoardInfo(boardId);
        const totalPage = this.getTotalPage(topicInfo.replyCount);
        const floor = (topicInfo.replyCount + 1) % 10;
        //如果page超过最大页码，就跳转到最大页码
        if (page > totalPage) {
            page = totalPage;
            const url = `/topic/${topicInfo.id}/${page}#${floor}`;
            this.props.history.push(url);
        }
        const isFav = await Utility.getFavState(newProps.match.params.topicid);  
        this.setState({ page: page, topicid: newProps.match.params.topicid, totalPage: totalPage, userName: userName, boardId: boardId, topicInfo: topicInfo, boardInfo: boardInfo, isFav: isFav });
        //更新一下未读消息数目
        Utility.refreshHoverUnReadCount();
    }
    async componentDidMount() {
        let page: number;
        if (!this.match.params.page) {
            page = 1;
        }
        else { page = parseInt(this.match.params.page); }
        const userName = this.match.params.userName;
        const topicInfo = await Utility.getTopicInfo(this.match.params.topicid);
        const boardId = topicInfo.boardId;
        const boardInfo = await Utility.getBoardInfo(boardId);
        const totalPage = this.getTotalPage(topicInfo.replyCount);
        const floor = (topicInfo.replyCount + 1) % 10;
        //如果page超过最大页码，就跳转到最大页码
        if (page > totalPage) {
            page = totalPage;
            const url = `/topic/${topicInfo.id}/${page}#${floor}`;
            this.props.history.push(url);
        }
        const isFav = await Utility.getFavState(this.match.params.topicid);
        let IPData = [];
       // if (Utility.isMaster(boardInfo.boardMasters))
      //   IPData = await Utility.findIP(this.match.params.topicid);
        this.setState({ isFav, page: page, topicid: this.match.params.topicid, totalPage: totalPage, userName: userName, boardId: boardId, topicInfo: topicInfo, boardInfo: boardInfo, fetchState: topicInfo, IPData: IPData });
        //更新一下未读消息数目
        Utility.refreshHoverUnReadCount();
    }
    getTotalPage(count) {
        return Utility.getTotalPageof10(count);
    }
    
    render() {
        
        switch (this.state.fetchState) {
            case 'ok':
                return <div></div>;
            case 'not found':
                return <NotFoundTopic />;
            case 'unauthorized':
                return <UnauthorizedTopic />;
            case 'server error':
                return <ServerError />
        }
        let topic = null;
        let hotReply = null;
        let topicInfo = null;
        topicInfo = <TopicInfo topicInfo={this.state.topicInfo} tag1={this.state.topicInfo.tag1} tag2={this.state.topicInfo.tag2} boardInfo={this.state.boardInfo}  isFav={this.state.isFav} />;
        if (parseInt(this.match.params.page) === 1 || !this.match.params.page) {
            hotReply = <Reply topicInfo={this.state.topicInfo} page={this.match.params.page} boardInfo={this.state.boardInfo} quote={this.quote} isTrace={false} isHot={true} postId={null} topicId={this.match.params.topicid} />
        }
        const pagerUrl = `/topic/${this.state.topicid}/`;
        let sendTopic = null;
        if (Utility.getLocalStorage("userInfo"))
            sendTopic = <SendTopic onChange={this.handleChange}   boardInfo={this.state.boardInfo} content={this.state.quote}  topicInfo={this.state.topicInfo} />;
        let topicHtml = <div className="center" >
            <DocumentTitle title={`${this.state.topicInfo.title||"帖子"} - CC98论坛`} />
            <FindIP data={this.state.IPData}/>
            <div className="row" style={{ width: "100%", justifyContent: 'space-between', alignItems: "center" }}>
                <Category topicInfo={this.state.topicInfo} boardInfo={this.state.boardInfo} topicId={this.match.params.topicid} />
                <Pager page={this.state.page} url={pagerUrl} totalPage={this.state.totalPage} />
            </div>
            {topicInfo}
            <Reply topicInfo={this.state.topicInfo} page={this.state.page} boardInfo={this.state.boardInfo} quote={this.quote} isHot={false} isTrace={false} postId={null} topicId={this.match.params.topicid} />
            <div className="row" style={{ width: "100%", justifyContent: "space-between", marginTop: "2rem" }}>
                <Category topicInfo={this.state.topicInfo} boardInfo={this.state.boardInfo} topicId={this.match.params.topicid} />
                <Pager page={this.state.page} url={pagerUrl} totalPage={this.state.totalPage} /></div>
            {sendTopic}
            <NoticeMessage text="回复成功" id="replyMessage" top="24%" left="46%" />
        </div>
            ;
        return topicHtml;
        /*  if (this.state.shouldRender) {
          
          } else {
              return <img src="/static/images/waiting.gif"/>;
          }*/


    }

}
export const ShowTopic = withRouter(Post);













