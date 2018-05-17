import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import * as io from 'socket.io-client';
import { AuthenticationService } from "../_services/authentication.service";
import { Observable } from "rxjs/Rx";
import { ConversationService } from "../_services/conversation.service";
@Component({
  templateUrl: './user.component.html',
  selector: 'user-component'
})

export class UserComponent implements OnInit {

  public userForm: FormGroup
  public email: FormControl
  public password: FormControl

  public conversationForm: FormGroup
  public receiver: FormControl
  public body: FormControl

  private token: string;
  private user: any;

  private socket: SocketIOClient.Socket;

  private observable: Observable<any>;

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private conversationService: ConversationService
  ) {

  }

  ngOnInit() {
    this.email = this.fb.control('', Validators.required)
    this.password = this.fb.control('', Validators.required)

    this.userForm = this.fb.group({
      email: this.email,
      password: this.password
    })

    this.receiver = this.fb.control('', Validators.required)
    this.body = this.fb.control('', Validators.required)

    this.conversationForm = this.fb.group({
      receiver: this.receiver,
      body: this.body
    })
  }

  login() {
    this.authenticationService.localLogin(this.userForm.value).subscribe(
      res => {
        this.socket = io.connect('http://localhost:3001', { query: {
          user_id: res.user._id
        }});

        localStorage.setItem('token', res.token);
        localStorage.setItem('currentUser', JSON.stringify(res.user));

        this.init_socket();
      }
    )
  }

  init_socket() {
    this.observable = Observable.create(observer => {
      this.socket.on('new conversation', msg => {
        observer.next(msg)
      })
    })

    this.observable.subscribe(msg => console.log(msg))
  }

  conversation_create() {
    this.conversationService.conversation_create(this.conversationForm.value).subscribe(
      conversation => {
        console.log(conversation)
      }
    )
  }


}
