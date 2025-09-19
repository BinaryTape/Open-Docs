# 첨부 파일

[:material-github: GitHub에서 열기](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Attachments.ipynb
){ .md-button .md-button--primary }
[:material-download: .ipynb 다운로드](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Attachments.ipynb
){ .md-button }

## 환경 설정

코드를 시작하기 전에 Kotlin Notebook이 준비되었는지 확인합니다.
여기서는 최신 디스크립터를 로드하고 AI 모델 공급자 (AI model providers) 와 연동할 수 있는 깔끔한 API를 제공하는 **Koog** 라이브러리를 활성화합니다.

```kotlin
// Kotlin Notebook용 Koog 통합을 활성화하고 최신 디스크립터를 로드합니다.
// 이를 통해 Koog DSL 유형과 실행기(executor)를 이후 셀에서 사용할 수 있습니다.
%useLatestDescriptors
%use koog
```

## API 키 구성

환경 변수에서 API 키를 읽어옵니다. 이렇게 하면 비밀 정보가 노트북 파일 외부에 유지되며 공급자 (provider) 를 전환할 수 있습니다.
`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, 또는 `GEMINI_API_KEY`를 설정할 수 있습니다.

```kotlin
val apiKey = System.getenv("OPENAI_API_KEY") // or ANTHROPIC_API_KEY, or GEMINI_API_KEY
```

## 간단한 OpenAI 실행기 생성

실행기 (executor) 는 인증, 기본 URL, 그리고 올바른 기본값을 캡슐화합니다. 여기서는 간단한 OpenAI 실행기를 사용하지만, 나머지 코드를 변경하지 않고 Anthropic 또는 Gemini 실행기로 교체할 수 있습니다.

```kotlin
// --- 공급자 선택 ---
// OpenAI 호환 모델용입니다. 대안으로는 다음이 있습니다:
//   val executor = simpleAnthropicExecutor(System.getenv("ANTHROPIC_API_KEY"))
//   val executor = simpleGeminiExecutor(System.getenv("GEMINI_API_KEY"))
// 모든 실행기는 동일한 고급 API를 제공합니다.
val executor = simpleOpenAIExecutor(apiKey)
```

Koog의 프롬프트 DSL은 **구조화된 마크다운**과 **첨부 파일**을 추가할 수 있게 합니다.
이 셀에서는 모델에게 짧은 블로그 스타일의 "콘텐츠 카드 (content card)" 를 생성하도록 요청하는 프롬프트를 만들고, 로컬 `images/` 디렉터리에서 두 개의 이미지를 첨부합니다.

```kotlin
import ai.koog.prompt.markdown.markdown
import kotlinx.io.files.Path

val prompt = prompt("images-prompt") {
    system("Instagram 게시물에 대한 멋지고 재미있는 설명을 작성할 수 있는 전문 비서입니다.")

    user {
        markdown {
            +"인스타그램에 새 게시물을 만들고 싶습니다."
            br()
            +"다음 사진들을 사용하여 제 인스타그램 게시물에 창의적인 글을 작성해 주시겠어요?"
            br()
            h2("요구 사항")
            bulleted {
                item("매우 재미있고 창의적이어야 합니다.")
                item("제가 엄청 유명한 블로거가 될 가능성을 높여야 합니다!!!!")
                item("노골적인 콘텐츠, 괴롭힘 또는 따돌림을 포함해서는 안 됩니다.")
                item("짧고 눈길을 끄는 문구여야 합니다.")
                item("게시물의 가시성을 높일 수 있는 관련 해시태그를 포함해야 합니다.")
            }
        }

        attachments {
            image(Path("images/kodee-loving.png"))
            image(Path("images/kodee-electrified.png"))
        }
    }
}
```

## 응답 실행 및 검사

프롬프트를 `gpt-4.1` 모델에 대해 실행하고 첫 번째 메시지를 수집한 후 그 내용을 출력합니다.
스트리밍을 원한다면 Koog의 스트리밍 API로 전환하고, 도구 사용을 위해서는 `emptyList()` 대신 도구 목록을 전달하세요.

> 문제 해결:
> * **401/403** — API 키/환경 변수를 확인하세요.
> * **파일을 찾을 수 없음** — `images/` 경로를 확인하세요.
> * **요청 제한** — 필요한 경우 호출 주변에 최소한의 재시도/백오프를 추가하세요.

```kotlin
import kotlinx.coroutines.runBlocking

runBlocking {
    val response = executor.execute(prompt = prompt, model = OpenAIModels.Chat.GPT4_1, tools = emptyList()).first()
    println(response.content)
}
```

    캡션:
    귀여움과 넘치는 웃음으로 구동 중! 경고: 부작용으로 심장 강탈 분위기와 자발적인 댄스 파티가 포함될 수 있습니다. 💜🤖💃
    
    해시태그:  
    #ViralVibes #UltraFamousBlogger #CutieAlert #QuirkyContent #InstaFun #SpreadTheLove #DancingIntoFame #RobotLife #InstaFamous #FeedGoals

```kotlin
runBlocking {
    val response = executor.executeStreaming(prompt = prompt, model = OpenAIModels.Chat.GPT4_1)
    response.collect { print(it) }
}
```

    캡션:  
    좋은 분위기와 Wi-Fi만으로 작동 중! 🤖💜 회로의 기쁨을 느낀다면 '좋아요'를 눌러주세요! #BlogBotInTheWild #HeartDeliveryService #DancingWithWiFi #UltraFamousBlogger #MoreFunThanYourAICat #ViralVibes #InstaFun #BeepBoopFamous