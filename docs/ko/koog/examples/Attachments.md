# 첨부 파일

[:material-github: Open on GitHub](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Attachments.ipynb
){ .md-button .md-button--primary }
[:material-download: Download .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Attachments.ipynb
){ .md-button }

## 환경 설정

코드를 살펴보기 전에, Kotlin Notebook이 준비되었는지 확인합니다.
여기서는 최신 디스크립터를 로드하고 **Koog** 라이브러리를 활성화합니다.
이 라이브러리는 AI 모델 제공자와 작업하기 위한 깔끔한 API를 제공합니다.

```kotlin
// 최신 디스크립터를 로드하고 Kotlin Notebook용 Koog 통합을 활성화합니다.
// 이를 통해 이후 셀에서 Koog DSL 타입과 실행기를 사용할 수 있습니다.
%useLatestDescriptors
%use koog
```

## API 키 구성하기

환경 변수에서 API 키를 읽어옵니다. 이렇게 하면 비밀 정보를 노트북 파일에 노출하지 않고도 
제공자를 전환할 수 있습니다. `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, 또는 `GEMINI_API_KEY`를 설정할 수 있습니다.

```kotlin
val apiKey = System.getenv("OPENAI_API_KEY") // 또는 ANTHROPIC_API_KEY, 또는 GEMINI_API_KEY
```

## 단순 OpenAI 실행기 생성하기

실행기(executor)는 인증, 베이스 URL 및 올바른 기본값들을 캡슐화합니다. 여기서는 단순한 OpenAI 실행기를 사용하지만, 
코드의 나머지 부분을 변경하지 않고도 Anthropic이나 Gemini로 교체할 수 있습니다.

```kotlin
// --- 제공자 선택 ---
// OpenAI 호환 모델용. 대안은 다음과 같습니다:
//   val executor = simpleAnthropicExecutor(System.getenv("ANTHROPIC_API_KEY"))
//   val executor = simpleGeminiExecutor(System.getenv("GEMINI_API_KEY"))
// 모든 실행기는 동일한 고수준 API를 제공합니다.
val executor = simpleOpenAIExecutor(apiKey)
```

Koog의 프롬프트 DSL을 사용하면 **구조화된 Markdown**과 **첨부 파일**을 추가할 수 있습니다.
이 셀에서는 모델이 짧은 블로그 스타일의 "콘텐츠 카드"를 생성하도록 요청하는 프롬프트를 작성하고,
로컬 `images/` 디렉터리에 있는 두 개의 이미지를 첨부합니다.

```kotlin
import ai.koog.prompt.markdown.markdown
import kotlinx.io.files.Path

val prompt = prompt("images-prompt") {
    system("You are professional assistant that can write cool and funny descriptions for Instagram posts.")

    user {
        markdown {
            +"I want to create a new post on Instagram."
            br()
            +"Can you write something creative under my instagram post with the following photos?"
            br()
            h2("Requirements")
            bulleted {
                item("It must be very funny and creative")
                item("It must increase my chance of becoming an ultra-famous blogger!!!!")
                item("It not contain explicit content, harassment or bullying")
                item("It must be a short catching phrase")
                item("You must include relevant hashtags that would increase the visibility of my post")
            }
        }

        attachments {
            image(Path("images/kodee-loving.png"))
            image(Path("images/kodee-electrified.png"))
        }
    }
}
```

## 실행 및 결과 확인

`gpt-4.1`에 대해 프롬프트를 실행하고, 첫 번째 메시지를 수집하여 그 내용을 출력합니다.
스트리밍이 필요한 경우 Koog의 스트리밍 API로 전환하세요. 도구(tool)를 사용하려면 `emptyList()` 대신 도구 목록을 전달하세요.

> 문제 해결:
> * **401/403** — API 키 및 환경 변수를 확인하세요.
> * **File not found** — `images/` 경로를 확인하세요.
> * **Rate limits** — 필요한 경우 호출 시 최소한의 재시도(retry)/백오프(backoff) 로직을 추가하세요.

```kotlin
import kotlinx.coroutines.runBlocking

runBlocking {
    val response = executor.execute(prompt = prompt, model = OpenAIModels.Chat.GPT4_1, tools = emptyList()).first()
    println(response.content)
}
```

    Caption:
    Running on cuteness and extra giggle power! Warning: Side effects may include heart-thief vibes and spontaneous dance parties. 💜🤖💃
    
    Hashtags:  
    #ViralVibes #UltraFamousBlogger #CutieAlert #QuirkyContent #InstaFun #SpreadTheLove #DancingIntoFame #RobotLife #InstaFamous #FeedGoals

```kotlin
runBlocking {
    val response = executor.executeStreaming(prompt = prompt, model = OpenAIModels.Chat.GPT4_1)
    response.collect { print(it) }
}
```

    Caption:  
    Running on good vibes & wi-fi only! 🤖💜 Drop a like if you feel the circuit-joy! #BlogBotInTheWild #HeartDeliveryService #DancingWithWiFi #UltraFamousBlogger #MoreFunThanYourAICat #ViralVibes #InstaFun #BeepBoopFamous