
// import '../mock'
import type { FilterSpeaker, LabelValue, Speaker } from '@/model'
import type { FilterBarSearch } from '@/components/bar-search'
import type { CancellationToken } from '@/utils'
import type { AudioInfo } from '@/menu/conversion-menu/data'
import voices from '../mock/voices'
import DataSource from '../mock/data'
import { getStyleDes, getRoleDes } from '../mock/emoji-config'
export async function english(word: string): Promise<LabelValue[]> {
  // const resp = await axios.get('/english', { params: { word } })
  // return resp.data
  const data = (DataSource.english as Record<string, LabelValue[]>)[word] || []
  return data;
}

export async function bgm(filter: FilterBarSearch): Promise<LabelValue[]> {
  // const resp = await axios.get('/bgm', { params: { ...filter } })
  // return resp.data
  const data = DataSource.audio
    .filter((v) => v.label.includes(filter.word))
    .filter((v) => v.menu.includes(filter.menu))
    .filter((v) => v.scene.includes(filter.scene))
    .filter((v) => v.style.includes(filter.style))
    .map<LabelValue>((v) => ({ label: v.label, value: v.value }));
  return data;
}

export async function special(filter: FilterBarSearch): Promise<LabelValue[]> {
  // const resp = await axios.get('/special', { params: { ...filter } })
  // return resp.data
  const data = DataSource.audio
    .filter((v) => v.label.includes(filter.word))
    .filter((v) => v.menu.includes(filter.menu))
    .filter((v) => v.scene.includes(filter.scene))
    .filter((v) => v.style.includes(filter.style))
    .map<LabelValue>((v) => ({ label: v.label, value: v.value }))
  return data;
}

export async function scene(): Promise<LabelValue[]> {
  // const resp = await axios.get('/scene')
  // return resp.data
  const data = [
    { label: '默认场景', value: '' },
    { label: '场景1', value: '1' },
    { label: '场景2', value: '2' },
  ]
  return data
}

export async function style(): Promise<LabelValue[]> {
  // const resp = await axios.get('/style')
  // return resp.data
  const data = [
    { label: '默认风格', value: '' },
    { label: '风格1', value: '1' },
    { label: '风格2', value: '2' },
  ]
  return data;
}

export async function tag(): Promise<LabelValue[]> {
  // const resp = await axios.get('/tag')
  // return resp.data
  return DataSource.speaker.tags;
}

export async function speaker(filter: FilterSpeaker): Promise<Speaker[]> {
  // const resp = await axios.get('/speaker', { params: { ...filter } })
  // return resp.data
  const data = voices
    .filter((v) => v.LocalName.includes(filter.word))
    .filter((v) => v.gender.includes(filter.gender))
    .map(
      (v) =>
        <Speaker>{
          id: v.name,
          displayName: v.LocalName,
          name: v.name,
          isFree: v.LocalName !== '云健',
          isStar: false,
          isSupper24K: true,
          avatar: '',
          gender:v.gender,
          localeZH:v.localeZH,
          roles: v.VoiceRoleNames.split(',').map((n) => {
            const des = getRoleDes(n)
            return { label: des?.word || n, value: n, emoji: des?.emoji }
          }),
          styles: v.VoiceStyleNames.split(',').map((n) => {
            const des = getStyleDes(n)
            return { label: des?.word || n, value: n, emoji: des?.emoji }
          }),
        },
    )
    return data;
    // return Promise.resolve(data);

}

export async function star(speaker: string, star: boolean): Promise<boolean> {
  // const resp = await axios.get('/star', { params: { speaker, star } })
  // return resp.data

  const [child] = voices.filter((v) => v.name === speaker)
  if (child) {
    return star
  }
  return false
}

export async function upload(file: File, token: CancellationToken): Promise<AudioInfo> {
  console.log("upload:",file,token);
  // const source = axios.CancelToken.source()
  // const formData = new FormData()
  // formData.append('file', file)
  // const resp = await axios.post('/upload', formData, {
  //   headers: {
  //     'Content-Type': 'multipart/form-data',
  //   },
  //   cancelToken: source.token,
  //   onUploadProgress: () => {
  //     token.isCancellationRequested() && source.cancel()
  //   },
  // })
  // return resp.data

  const data: AudioInfo = { id: '1', src: DataSource.audio[0].value }
  return data
}

export async function transfer(opt: { audioId: string; speakerId: string }): Promise<AudioInfo> {
  // const resp = await axios.put('/transfer', { params: { ...opt } })
  // return resp.data
  console.log("transfer:",opt);
  const data: AudioInfo = { id: '1', src: DataSource.audio[0].value }
  return data
}

export async function conversionSpeaker(): Promise<Speaker[]> {
  // const resp = await axios.get('/conversionSpeaker')
  // return resp.data

  const data = voices.map(
    (v) =>
      <Speaker>{
        id: v.name,
        displayName: v.LocalName,
        name: v.name,
        isFree: false,
        isStar: false,
        isSupper24K: true,
        avatar: '',
        roles: v.VoiceRoleNames.split(',').map((n) => {
          const des = getRoleDes(n)
          return { label: des?.word || n, value: n, emoji: des?.emoji }
        }),
        styles: v.VoiceStyleNames.split(',').map((n) => {
          const des = getStyleDes(n)
          return { label: des?.word || n, value: n, emoji: des?.emoji }
        }),
      },
  )
  return data
}

export async function play(ssmlGetter: () => string): Promise<AudioInfo> {
  const ssml = ssmlGetter()
  // const resp = await axios.post('/play', { ssml })
  // return resp.data
  console.log("play ssml:",ssml);

  const audio = DataSource.audio.find((v) => v.label === 'creativeminds') || DataSource.audio[0]
  return <AudioInfo>{ id: 'id', src: audio.value }

}
 

