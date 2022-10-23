import { Routes } from '@angular/router';
import { InputDataComponent } from './input-data/input-data.component';
import { DataMasterComponent } from './data-master/data-master.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { GraphComponent } from './graph/graph.component';
import { UploadDataComponent } from './upload-data/upload-data.component';

export const ComponentsRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'input-data',
				component: InputDataComponent
			},
			{
				path: 'data-master',
				component: DataMasterComponent
			},
			{
				path: 'schedule',
				component: ScheduleComponent
			},
			{
				path: 'graph',
				component: GraphComponent
			},
			{
				path: 'upload-data',
				component:UploadDataComponent
			},
			{ path: '', redirectTo: '/dashboard', pathMatch: 'full' }
		]
	}
];
