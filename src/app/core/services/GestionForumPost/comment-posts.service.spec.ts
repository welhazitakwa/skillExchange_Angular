import { TestBed } from '@angular/core/testing';

import { CommentPostsService } from './comment-posts.service';

describe('CommentPostsService', () => {
  let service: CommentPostsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentPostsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
