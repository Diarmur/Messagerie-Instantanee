export interface User {
  id: number
  username: string
}

export interface ChannelTheme {
  primary_color: string
  primary_color_dark: string
  accent_color: string
  text_color: string
  accent_text_color: string
}

export interface Channel {
  id: number
  name: string
  img: string | null
  creator: string
  theme: ChannelTheme | null
  users: string[]
}

export interface NewChannel {
  name: string
  img: string
  members?: string
}

export interface UpdateChannel{
  channelId: number
  name?: string
  img?: string
  members?: string
  theme: ChannelTheme | null
}

export interface ChannelFormData {
  name: string
  img: string
  members?: string
  primary_color: string
  primary_color_dark: string
  accent_color: string
  text_color: string 
  accent_text_color: string
}
