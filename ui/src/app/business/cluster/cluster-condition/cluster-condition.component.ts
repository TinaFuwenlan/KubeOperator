import {Component, OnInit} from '@angular/core';
import {ClusterService} from '../cluster.service';
import {ClusterStatus, Condition} from '../cluster';

@Component({
    selector: 'app-cluster-condition',
    templateUrl: './cluster-condition.component.html',
    styleUrls: ['./cluster-condition.component.css']
})
export class ClusterConditionComponent implements OnInit {

    opened = false;
    clusterName: string;
    item: ClusterStatus = new ClusterStatus();
    loading = false;
    timer;

    constructor(private service: ClusterService) {
    }

    ngOnInit(): void {
    }

    onCancel() {
        clearInterval(this.timer);
        this.opened = false;
    }

    open(clusterName: string) {
        this.clusterName = clusterName;
        this.getStatus();
        this.polling();
    }

    getStatus() {
        this.opened = true;
        this.service.status(this.clusterName).subscribe(data => {
            this.item = data;
            this.loading = false;
        });
    }

    getCurrentCondition(): Condition {
        if (this.item.phase !== 'Running' && this.item.phase !== 'Failed') {
            for (const item of this.item.conditions) {
                if (item.status === 'Unknown') {
                    return item;
                }
            }
        }
        return null;
    }

    onInit() {
        this.service.init(this.clusterName).subscribe(data => {
            this.polling();
        });
    }

    polling() {
        this.timer = setInterval(() => {
            this.service.status(this.clusterName).subscribe(data => {
                if (this.item.phase !== 'Running') {
                    this.item.conditions = data.conditions;
                } else {
                    clearInterval(this.timer);
                }
                if (this.item.phase !== data.phase) {
                    this.item.phase = data.phase;
                }
            });
        }, 3000);
    }

}