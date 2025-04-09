---
title: "비동기 프로그래밍 기술"
---
오랫동안 개발자로서 우리는 애플리케이션의 차단을 방지하는 방법을 해결해야 하는 문제에 직면해 왔습니다. 데스크톱, 모바일, 심지어 서버 측 애플리케이션을 개발하든 사용자가 기다리는 것을 피하고 싶고, 더 나쁜 것은 애플리케이션의 확장을 막는 병목 현상을 일으키는 것입니다.

이 문제를 해결하기 위한 많은 접근 방식이 있었습니다.

* [Threading](#threading)
* [Callbacks](#callbacks)
* [Futures, promises, and others](#futures-promises-and-others)
* [Reactive Extensions](#reactive-extensions)
* [Coroutines](#coroutines)

코루틴이 무엇인지 설명하기 전에 다른 솔루션 몇 가지를 간단히 검토해 보겠습니다.

## Threading

스레드는 애플리케이션의 차단을 방지하는 가장 잘 알려진 접근 방식일 것입니다.

```kotlin
fun postItem(item: Item) {
    val token = preparePost()
    val post = submitPost(token, item)
    processPost(post)
}

fun preparePost(): Token {
    // makes a request and consequently blocks the main thread
    return token
}
```

위의 코드에서 `preparePost`가 시간이 오래 걸리는 프로세스이고 결과적으로 사용자 인터페이스를 차단한다고 가정해 보겠습니다. 별도의 스레드에서 실행할 수 있습니다. 이렇게 하면 UI가 차단되는 것을 방지할 수 있습니다. 이것은 매우 일반적인 기술이지만 다음과 같은 일련의 단점이 있습니다.

* 스레드는 저렴하지 않습니다. 스레드는 비용이 많이 드는 컨텍스트 전환이 필요합니다.
* 스레드는 무한하지 않습니다. 시작할 수 있는 스레드 수는 기본 운영 체제에 의해 제한됩니다. 서버 측 애플리케이션에서는 이것이 주요 병목 현상을 일으킬 수 있습니다.
* 스레드를 항상 사용할 수 있는 것은 아닙니다. JavaScript와 같은 일부 플랫폼은 스레드를 지원하지도 않습니다.
* 스레드는 쉽지 않습니다. 스레드를 디버깅하고 경합 조건을 방지하는 것은 다중 스레드 프로그래밍에서 흔히 겪는 문제입니다.

## Callbacks

콜백을 사용하면 하나의 함수를 다른 함수의 매개변수로 전달하고 프로세스가 완료되면 이 함수를 호출하는 것입니다.

```kotlin
fun postItem(item: Item) {
    preparePostAsync { token `->` 
        submitPostAsync(token, item) { post `->` 
            processPost(post)
        }
    }
}

fun preparePostAsync(callback: (Token) `->` Unit) {
    // make request and return immediately 
    // arrange callback to be invoked later
}
```

원칙적으로 이것은 훨씬 더 우아한 솔루션처럼 느껴지지만 다시 한 번 몇 가지 문제가 있습니다.

* 중첩된 콜백의 어려움. 콜백으로 사용되는 함수는 종종 자체 콜백이 필요하게 됩니다. 이것은 일련의 중첩된 콜백으로 이어져 이해할 수 없는 코드로 이어집니다. 이 패턴은 종종 콜백 지옥 또는 이러한 깊이 중첩된 콜백에서 들여쓰기가 만드는 삼각형 모양 때문에 [파멸의 피라미드](https://en.wikipedia.org/wiki/Pyramid_of_doom_(programming))라고 합니다.
* 오류 처리가 복잡합니다. 중첩 모델은 오류 처리 및 이러한 오류의 전파를 다소 더 복잡하게 만듭니다.

콜백은 JavaScript와 같은 이벤트 루프 아키텍처에서 매우 일반적이지만 일반적으로 사람들조차도 promises 또는 반응형 확장과 같은 다른 접근 방식을 사용하는 쪽으로 이동했습니다.

## Futures, promises, and others

미래 또는 약속(언어 또는 플랫폼에 따라 다른 용어가 사용될 수 있음)의 배후 아이디어는 호출을 할 때 특정 시점에 호출이 `Promise` 객체를 반환할 것이라고 _약속_되며, 이를 통해 작업을 수행할 수 있다는 것입니다.

```kotlin
fun postItem(item: Item) {
    preparePostAsync() 
        .thenCompose { token `->` 
            submitPostAsync(token, item)
        }
        .thenAccept { post `->` 
            processPost(post)
        }
         
}

fun preparePostAsync(): Promise<Token> {
    // makes request and returns a promise that is completed later
    return promise 
}
```

이 접근 방식에는 프로그래밍 방식에 일련의 변경이 필요합니다. 특히 다음과 같습니다.

* 다른 프로그래밍 모델. 콜백과 유사하게 프로그래밍 모델은 하향식 명령적 접근 방식에서 체인 호출이 있는 구성적 모델로 이동합니다. 루프, 예외 처리 등과 같은 기존 프로그램 구조는 일반적으로 이 모델에서 더 이상 유효하지 않습니다.
* 다른 API. 일반적으로 `thenCompose` 또는 `thenAccept`와 같이 완전히 새로운 API를 배워야 하며 플랫폼에 따라 다를 수도 있습니다.
* 특정 반환 유형. 반환 유형은 필요한 실제 데이터에서 벗어나 대신 조사해야 하는 새 유형 `Promise`를 반환합니다.
* 오류 처리가 복잡할 수 있습니다. 오류의 전파 및 체인이 항상 간단하지는 않습니다.

## Reactive extensions

Rx(Reactive Extensions)는 [Erik Meijer](https://en.wikipedia.org/wiki/Erik_Meijer_(computer_scientist))가 C#에 도입했습니다. .NET 플랫폼에서 확실히 사용되었지만 Netflix에서 Java로 포팅하여 RxJava라고 명명할 때까지 주류 채택에 도달하지 못했습니다. 그 이후로 JavaScript(RxJS)를 포함한 다양한 플랫폼에 대한 수많은 포트가 제공되었습니다.

Rx의 배후 아이디어는 우리가 데이터를 스트림(무한한 양의 데이터)으로 생각하고 이러한 스트림을 관찰할 수 있는 `관찰 가능한 스트림`으로 이동하는 것입니다. 실제로 Rx는 데이터를 작동할 수 있도록 해주는 일련의 확장이 있는 [Observer Pattern](https://en.wikipedia.org/wiki/Observer_pattern)일 뿐입니다.

접근 방식에서 Futures와 매우 유사하지만 Future는 별개의 요소를 반환하는 것으로 생각할 수 있는 반면 Rx는 스트림을 반환합니다. 그러나 이전과 유사하게 프로그래밍 모델에 대한 완전히 새로운 사고방식을 도입합니다. 유명한 문구는 다음과 같습니다.

    "everything is a stream, and it's observable"
    
이것은 문제에 접근하는 다른 방식과 동기식 코드를 작성할 때 익숙한 것에서 상당히 큰 변화를 의미합니다. Futures와 비교했을 때 한 가지 이점은 매우 많은 플랫폼으로 포팅되었기 때문에 일반적으로 C#, Java, JavaScript 또는 Rx를 사용할 수 있는 다른 언어에 관계없이 일관된 API 경험을 찾을 수 있다는 것입니다.

또한 Rx는 오류 처리에 다소 더 나은 접근 방식을 제공합니다.

## Coroutines

비동기 코드를 사용하는 Kotlin의 접근 방식은 일시 중단 가능한 계산이라는 아이디어인 코루틴을 사용하는 것입니다. 즉, 함수가 특정 시점에서 실행을 일시 중단하고 나중에 다시 시작할 수 있다는 아이디어입니다.

그러나 코루틴의 한 가지 이점은 개발자가 비차단 코드를 작성하는 것이 기본적으로 차단 코드를 작성하는 것과 동일하다는 것입니다. 프로그래밍 모델 자체는 실제로 변경되지 않습니다.

예를 들어 다음 코드를 살펴보십시오.

```kotlin
fun postItem(item: Item) {
    launch {
        val token = preparePost()
        val post = submitPost(token, item)
        processPost(post)
    }
}

suspend fun preparePost(): Token {
    // makes a request and suspends the coroutine
    return suspendCoroutine { /* ... */ } 
}
```

이 코드는 기본 스레드를 차단하지 않고 시간이 오래 걸리는 작업을 시작합니다. `preparePost`는 `일시 중단 가능한 함수`라고 하며, 따라서 `suspend` 키워드가 앞에 붙습니다. 위에서 언급했듯이 이것이 의미하는 바는 함수가 실행되고, 실행을 일시 중지하고, 특정 시점에 다시 시작된다는 것입니다.

* 함수 서명은 정확히 동일하게 유지됩니다. 유일한 차이점은 `suspend`가 추가되었다는 것입니다. 그러나 반환 유형은 반환하려는 유형입니다.
* 코드는 여전히 동기식 코드를 작성하는 것처럼 위에서 아래로 특별한 구문이 필요 없이 작성됩니다. 기본적으로 코루틴을 시작하는 `launch`라는 함수를 사용하는 것 외에는 없습니다(다른 튜토리얼에서 다룸).
* 프로그래밍 모델 및 API는 동일하게 유지됩니다. 루프, 예외 처리 등을 계속 사용할 수 있으며 완전히 새로운 API 세트를 배울 필요가 없습니다.
* 플랫폼에 독립적입니다. JVM, JavaScript 또는 기타 플랫폼을 타겟팅하든 작성하는 코드는 동일합니다. 내부적으로 컴파일러는 각 플랫폼에 맞게 조정합니다.

코루틴은 새로운 개념이 아니며 Kotlin에서 발명된 것도 아닙니다. 그들은 수십 년 동안 존재해 왔으며 Go와 같은 다른 프로그래밍 언어에서 인기가 있습니다. 그러나 Kotlin에서 구현되는 방식은 대부분의 기능이 라이브러리에 위임된다는 점에 주목하는 것이 중요합니다. 실제로 `suspend` 키워드 외에는 다른 키워드가 언어에 추가되지 않습니다. 이것은 C#과 같이 `async` 및 `await`를 구문의 일부로 사용하는 언어와는 다소 다릅니다. Kotlin에서는 이것들은 단지 라이브러리 함수일 뿐입니다.

자세한 내용은 [코루틴 참조](coroutines-overview)를 참조하십시오.