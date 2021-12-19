export type PostFilenameType = `${string}.md`;

export type PostFileType = {
  name: PostFilenameType;
  contents: string;
};

export interface GetPostFileFunction {
  (filename: PostFilenameType): Promise<PostFileType>;
}

export interface GetPostFilesFunction {
  (): Promise<PostFileType[]>;
}
