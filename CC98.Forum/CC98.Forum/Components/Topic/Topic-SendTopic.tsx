﻿import * as React from 'react';
import * as Utility from '../../Utility';
import * as $ from 'jquery';
import { UbbContainer } from '.././UbbContainer';
import { Constants } from '../Constant';
import { UbbEditor } from '../UbbEditor';
import { TopicManagement } from './Topic-TopicManagement';
declare let moment: any;
declare let editormd: any;
interface Props {
    boardInfo;
    onChange;
    content;
    userId;
    topicInfo;
}
export class SendTopic extends React.Component<Props, { content: string, mode: number, masters: string[],buttonInfo,buttonDisabled }>{
	constructor(props) {
		super(props);
		this.sendUbbTopic = this.sendUbbTopic.bind(this);
		this.changeEditor = this.changeEditor.bind(this);
		this.showManagement = this.showManagement.bind(this);
		this.onChange = this.onChange.bind(this);
		this.close = this.close.bind(this);
        this.update = this.update.bind(this);
        this.state = ({ content: '', mode: 0, masters: [], buttonDisabled: false, buttonInfo:"回复" });
	}
	update(value) {
		this.setState({ content: value });
	}
	onChange() {
		this.props.onChange();
	}
	showManagement() {
		const UIId = `#manage${this.props.topicInfo.id}`;
		$(UIId).css('display', '');
	}
	close() {
		const UIId = `#manage${this.props.topicInfo.id}`;
		$(UIId).css('display', 'none');
	}
    componentDidMount() {
    

		if (this.state.mode === 1) {
            /*const response1 = await fetch("/config.production.json");
            let data;
            if (response1.status !== 404) {
                const data1 = await response1.json();
                const response2 = await fetch("/config.json");
                const data2 = await response2.json();
                data = { ...data2, ...data1 };
            } else {
                const response2 = await fetch("/config.json");
                data = await response2.json();
            }
            const fileUrl = data.imageUploadUrl;*/
			const fileUrl = `${Utility.getApiUrl}/file`;
			editormd.emoji.path = '/static/images/emoji/';
			Constants.testEditor = editormd('test-editormd', {
				width: '100%',
				height: 400,
				path: '/static/scripts/lib/editor.md/lib/',
				saveHTMLToTextarea: false,
				imageUpload: false,
				imageFormats: ['jpg', 'jpeg', 'gif', 'png', 'bmp', 'webp'],
				imageUploadURL: fileUrl,
				emoji: true,
				toc: true,
				tocm: true,
				toolbarIcons() {
					return [
						'undo', 'redo', '|', 'emoji',
						'bold', 'del', 'italic', 'quote', '|',
						'h1', 'h2', 'h3', 'h4', '|',
						'list-ul', 'list-ol', 'hr', '|',
						'link', 'image', 'testIcon', 'code', 'table', 'html-entities',
					];
				},
				toolbarIconsClass: {
					testIcon: 'fa-upload'  // 指定一个FontAawsome的图标类
				},
				// 自定义工具栏按钮的事件处理
				toolbarHandlers: {
					testIcon() {
						$('#upload-files').click();

					}
				},
			});
		}
		const time = moment(this.props.content.replyTime).format('YYYY-MM-DD HH:mm:ss');
		const url = `/topic/${this.props.topicInfo.id}#${this.props.content.floor}`;
		const masters = this.props.boardInfo.masters;
		if (this.props.content) {
			if (this.state.mode === 1) {
				const str = `>**以下是引用${this.props.content.floor}楼：用户${this.props.content.userName}在${time}的发言：**
${this.props.content.content}
`;
				Constants.testEditor.appendMarkdown(str);

				this.setState({ masters: masters });
			} else {
				const str = `
[quote][b]以下是引用${this.props.content.floor}楼：用户${this.props.content.userName}在${time}的发言：
[color=blue][url=${url}]>>查看原帖<<[/url][/color][/b]${this.props.content.content}[/quote]
`;

				this.setState({ masters: masters, content: str });
			}
		}


	}
    componentWillReceiveProps(newProps) {
   
		const time = moment(newProps.content.replyTime).format('YYYY-MM-DD HH:mm:ss');
		if (newProps.content.userName) {
			if (this.state.mode === 1) {
				const str = `>**以下是引用${newProps.content.floor}楼：用户${newProps.content.userName}在${time}的发言：**
${newProps.content.content}
`;
				Constants.testEditor.appendMarkdown(str);
			} else {
				let floor = newProps.content.floor, page, url;
				if(floor > 10){
					page = parseInt(((floor - 1) / 10).toString()) + 1;
					floor = floor % 10;
					url = `/topic/${this.props.topicInfo.id}/${page}#${floor === 0 ? 10 : floor}`;
				} else {
					url = `/topic/${this.props.topicInfo.id}#${newProps.content.floor}`;
				}
				const str = `[quote][b]以下是引用${newProps.content.floor}楼：用户${newProps.content.userName}在${time}的发言：[color=blue][url=${url}]>>查看原帖<<[/url][/color][/b]
${newProps.content.content}[/quote]
`;
				this.setState({ content: str });
			}
		}
	}

	async componentDidUpdate() {
        /*const response1 = await fetch("/config.production.json");
        let data;
        if (response1.status !== 404) {
            const data1 = await response1.json();
            const response2 = await fetch("/config.json");
            const data2 = await response2.json();
            data = { ...data2, ...data1 };
        } else {
            const response2 = await fetch("/config.json");
            data = await response2.json();
        }
        const fileUrl = data.imageUploadUrl;*/

		//  editormd.emoji.path = '/static/images/emoji/';
		if (this.state.mode === 1) {
			const fileUrl = `${Utility.getApiUrl}/file`;
			editormd.emoji.path = '/static/images/emoji/';
			Constants.testEditor = editormd('test-editormd', {
				width: '100%',
				height: 400,
				path: '/static/scripts/lib/editor.md/lib/',
				saveHTMLToTextarea: false,
				imageUpload: false,
				imageFormats: ['jpg', 'jpeg', 'gif', 'png', 'bmp', 'webp'],
				imageUploadURL: fileUrl,
				emoji: true,
				toc: true,
				tocm: true,
				toolbarIcons() {
					return [
						'undo', 'redo', '|', 'emoji',
						'bold', 'del', 'italic', 'quote', '|',
						'h1', 'h2', 'h3', 'h4', '|',
						'list-ul', 'list-ol', 'hr', '|',
						'link', 'image', 'testIcon', 'code', 'table', 'html-entities',
					];
				},
				toolbarIconsClass: {
					testIcon: 'fa-upload'  // 指定一个FontAawsome的图标类
				},
				// 自定义工具栏按钮的事件处理
				toolbarHandlers: {
					testIcon() {
						$('#upload-files').click();
					}
				},
			});
		}
	}

	/*
    *处理ubb模式下的发帖内容
    *如果存在合法的@，则会返回一个字符串数组，包含至多10个合法的被@用户的昵称，否则返回false
    */
    atHanderler(content: string) {
        const reg = new RegExp("@[^ \n]{1,10}?[ \n]", "gm");
        const reg2 = new RegExp("[^@ ]+");
        if (content.match(reg)) {   //如果match方法返回了非null的值（即数组），则说明内容中存在合法的@
            let atNum = content.match(reg).length;  //合法的@数
            if (atNum > 10) atNum = 10;            //至多10个
            let ats: string[] = new Array();
            for (let i = 0; i < atNum; i++) {
                let anAt = content.match(reg)[i];
        
                let aUserName = reg2.exec(anAt)[0];
          
                ats[i] = aUserName;
            }
            return ats;
        } else {
            return false;
        }
    }

    async sendUbbTopic() {
        this.setState({ buttonDisabled: true, buttonInfo: "..." });
		const url = `/topic/${this.props.topicInfo.id}/post`;
		const bodyInfo = {
			content: this.state.content,
			contentType: 0,
			title: ''
		};
		const body = JSON.stringify(bodyInfo);
		const token = await Utility.getToken();
		const headers = new Headers();
		headers.append('Authorization', token);
		headers.append('Content-Type', 'application/json');
		const mes = await Utility.cc98Fetch(url, {
				method: 'POST',
				headers,
				body
			}
        );
        if (mes.status === 402) {
            alert('请输入内容');
            this.setState({ buttonDisabled: false, buttonInfo: "发帖" });
        }
		if (mes.status === 403) {
            alert('你太快啦 请慢一点~');
            this.setState({buttonDisabled: false, buttonInfo: "发帖" });
		} else if(mes.status === 200){
			const atUsers = this.atHanderler(this.state.content);
			//如果存在合法的@，则发送@信息，否则不发送，直接跳转至所发帖子
			if (atUsers) {
				const postId = await mes.text();
				const topicId = this.props.topicInfo.id;
				const atUsersJSON = JSON.stringify(atUsers);
				const url2 = `/notification/at?topicInfo.id=${topicId}&postid=${postId}`;
				let myHeaders2 = new Headers();
				myHeaders2.append("Content-Type", 'application/json');
				myHeaders2.append("Authorization", token);
				let response2 = await Utility.cc98Fetch(url2, {
					method: 'POST',
					headers: myHeaders2,
					body: atUsersJSON
				});
			}
			this.setState({ content: '',buttonDisabled:false,buttonInfo:"发帖" });
			this.props.onChange();
		}

	}
	async sendMdTopic() {
        try {
            this.setState({ buttonDisabled: true, buttonInfo: "..." });
			const url = `/topic/${this.props.topicInfo.id}/post`;
			const c = Constants.testEditor.getMarkdown();
			Constants.testEditor.setMarkdown('');
			const content = {
				content: c,
				contentType: 1,
				title: ''
			};
			const contentJson = JSON.stringify(content);
			const token = Utility.getLocalStorage('accessToken');
			const myHeaders = new Headers();
			myHeaders.append('Authorization', token);
			myHeaders.append('Content-Type', 'application/json');
			const mes = await Utility.cc98Fetch(url, {
					method: 'POST',
					headers: myHeaders,
					body: contentJson
				}
			);
			if (mes.status === 403) {
                alert('你太快啦 请慢一点~');
                this.setState({  buttonDisabled: false, buttonInfo: "发帖" });
			}
			if (mes.status === 402) {
                alert('请输入内容');
                this.setState({  buttonDisabled: false, buttonInfo: "发帖" });
			}
			this.props.onChange();

			/* editormd.emoji.path = '/static/images/emoji/';
			 const response1 = await fetch("/config.production.json");
			 let data;
			 if (response1.status !== 404) {
				 const data1 = await response1.json();
				 const response2 = await fetch("/config.json");
				 const data2 = await response2.json();
				 data = { ...data2, ...data1 };
			 } else {
				 const response2 = await fetch("/config.json");
				 data = await response2.json();
			 }
			 const fileUrl = data.imageUploadUrl;*/
			const fileUrl = `${Utility.getApiUrl}/file`;
			editormd.emoji.path = '/static/images/emoji/';
			Constants.testEditor = editormd('test-editormd', {
				width: '100%',
				height: 400,
				path: '/static/scripts/lib/editor.md/lib/',
				saveHTMLToTextarea: false,
				imageUpload: false,
				imageFormats: ['jpg', 'jpeg', 'gif', 'png', 'bmp', 'webp'],
				imageUploadURL: fileUrl,
				emoji: true,
				toc: true,
				tocm: true,
				toolbarIcons() {
					return [
						'undo', 'redo', '|', 'emoji',
						'bold', 'del', 'italic', 'quote', '|',
						'h1', 'h2', 'h3', 'h4', '|',
						'list-ul', 'list-ol', 'hr', '|',
						'link', 'image', 'testIcon', 'code', 'table', 'html-entities',
					];
				},
				toolbarIconsClass: {
					testIcon: 'fa-upload'  // 指定一个FontAawsome的图标类
				},
				// 自定义工具栏按钮的事件处理
				toolbarHandlers: {
					testIcon() {
						$('#upload-files').click();

					}
				},
			});
            this.setState({ content: '', buttonDisabled: false, buttonInfo: "发帖" });
		} catch (e) {
			console.log('Error');
			console.log(e);
		}
	}
	showIP() {
		$('.findIP').css('display', 'flex');
	}
	changeEditor() {
		if (this.state.mode === 0) {
			this.setState({ mode: 1 });
		} else {
			this.setState({ mode: 0 });
		}
	}

	getInitialState() {
		return { value: '' };
	}
	handleChange(event) {
		this.setState({ content: event.target.value });
	}
	render() {
		let mode, editor;
		if (this.state.mode === 0) {
			mode = '使用UBB模式编辑';
            editor = <div>
                <UbbEditor update={this.update} value={this.state.content} option={{ height: 20, submit: this.sendUbbTopic }} />
                <div className="row" style={{ justifyContent: 'center', marginBottom: '1.25rem ' }}>
                    <button id="post-topic-button" onClick={this.sendUbbTopic} disabled={this.state.buttonDisabled} className="button blue" style={{ marginTop: '1.25rem', width: '6rem', height: '2rem', lineHeight: '2rem', letterSpacing: '0.3125rem' }}>{this.state.buttonInfo}
                    </button>
				</div></div>;
		}
		else {
			mode = '使用Markdown编辑';
			editor = <div id="sendTopic">
				<form>
					<input type="file" id="upload-files" style={{ display: 'none ' }} onChange={Utility.uploadEvent} />
					<div id="test-editormd" className="editormd">
						<textarea className="editormd-markdown-textarea" name="test-editormd-markdown-doc"   ></textarea>
					</div>
				</form>
                <div className="row" style={{ justifyContent: 'center', marginBottom: '1.25rem ' }}>
                    <button id="post-topic-button" disabled={this.state.buttonDisabled} onClick={this.sendMdTopic.bind(this)} className="button blue" style={{ marginTop: '1.25rem', width: '4.5rem', height: "2rem", lineHeight: "2rem" }}>{this.state.buttonInfo}</button>


				</div>

			</div>;
		}


		const uploadInfo = null;
		if (this.state.mode === 1) {

        }
        let manageBTN = null;
        if (Utility.isMaster(this.props.boardInfo.boardMasters))
            manageBTN = <div><button className="topicManageBTN" id="topicManagementBTN" style={{ width: '5rem' }} onClick={this.showManagement}>管理</button>
                <button id="showIPBTN" className="topicManageBTN" style={{ width: '5rem' }} onClick={this.showIP}>查看IP</button></div>;
        
		return <div id="sendTopicInfo" style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
			<div className="row" style={{ justifyContent:'flex-end' }}>

                <div id="post-topic-changeMode" className="hiddenImage" onClick={this.changeEditor.bind(this)} style={{ width: '12rem', marginBottom:"0.5rem" }}>{this.state.mode === 1 ? '切换到Ubb编辑器' : '切换到Markdown编辑器'}
				</div></div>
            {editor}
            {manageBTN}
            <TopicManagement update={this.onChange} boardId={this.props.boardInfo.id} updateTime={Date.now()} topicInfo={this.props.topicInfo} />
		</div>;
	}
}
