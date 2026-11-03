import { TestBed } from '@angular/core/testing';
import { Chat } from './chat';
describe('Chat', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Chat]
        })
            .compileComponents();
        fixture = TestBed.createComponent(Chat);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
