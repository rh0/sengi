import { Component, OnInit, OnDestroy, ViewChild, QueryList, ViewChildren, ElementRef } from "@angular/core";

import { Stream } from "../../models/stream.models";
import { Observable, Subscription } from "rxjs";
import { StreamElement } from "../../states/streams.state";
import { Store } from "@ngxs/store";
import { Http } from "@angular/http";
import { NavigationService } from "../../services/navigation.service";
import { HttpClient } from "@angular/common/http";
import { StreamingService } from "../../services/streaming.service";


@Component({
    selector: "app-streams-main-display",
    templateUrl: "./streams-main-display.component.html",
    styleUrls: ["./streams-main-display.component.scss"]
})
export class StreamsMainDisplayComponent implements OnInit, OnDestroy {

    streams: Stream[] = [];

    private streams$: Observable<StreamElement[]>;
    private streamsStateSub: Subscription;
    private columnSelectedSub: Subscription;

    constructor(
        private readonly streamingService: StreamingService,
        private readonly navigationService: NavigationService,
        private readonly httpClient: HttpClient,
        private readonly store: Store) {
        this.streams$ = this.store.select(state => state.streamsstatemodel.streams);

    }

    ngOnInit() {
        this.streamsStateSub = this.streams$.subscribe((streams: StreamElement[]) => {
            this.streams.length = 0;
            for (const stream of streams) {
                const newStream = new Stream(this.streamingService, this.httpClient, this.store, stream.name, stream.type, stream.username);
                this.streams.push(newStream);
            }

            this.columnSelectedSub = this.navigationService.columnSelectedSubject.subscribe((columnIndex: number) => {
                this.focusOnColumn(columnIndex);

            });
        });
    }

    ngOnDestroy(): void {
        this.streamsStateSub.unsubscribe();
        this.columnSelectedSub.unsubscribe();
    }

    @ViewChildren('stream', { read: ElementRef }) public streamsElementRef: QueryList<ElementRef>;;
    private focusOnColumn(columnIndex: number): void {
        console.warn(`col selected: ${columnIndex}`);

        if (columnIndex > -1) {
            console.warn(this.streamsElementRef);

            setTimeout(() => {
                this.streamsElementRef.toArray()[columnIndex].nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' });
            });
        }
    }

}
