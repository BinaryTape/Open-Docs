[//]: # (title: 비동기 프로그래밍 기법)

수십 년 동안, 개발자로서 우리는 애플리케이션이 블로킹되는 것을 막는 방법이라는 문제에 직면해 왔습니다. 데스크톱, 모바일, 심지어 서버 측 애플리케이션을 개발하든 상관없이, 우리는 사용자가 기다리게 하거나 더 나쁜 경우 애플리케이션 확장을 방해하는 병목 현상을 유발하는 것을 피하고 싶습니다.

이 문제를 해결하기 위한 많은 접근 방식이 있었으며, 다음을 포함합니다:

*   [스레딩](#threading)
*   [콜백](#callbacks)
*   [퓨처, 프로미스 및 기타](#futures-promises-and-others)
*   [리액티브 확장](#reactive-extensions)
*   [코루틴](#coroutines)

코루틴이 무엇인지 설명하기 전에, 다른 해결책들 중 일부를 간략히 살펴보겠습니다.

## 스레딩

스레드는 애플리케이션 블로킹을 피하기 위한 가장 잘 알려진 접근 방식일 것입니다.

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

위 코드에서 `preparePost`가 장시간 실행되는 프로세스이며 결과적으로 사용자 인터페이스를 블로킹한다고 가정해 봅시다. 우리가 할 수 있는 일은 이를 별도의 스레드에서 실행하는 것입니다. 이렇게 하면 UI가 블로킹되는 것을 피할 수 있습니다. 이것은 매우 흔한 기술이지만, 다음과 같은 단점들이 있습니다:

*   **스레드는 비용이 저렴하지 않습니다.** 스레드는 비용이 많이 드는 컨텍스트 스위치를 필요로 합니다.
*   **스레드는 무한하지 않습니다.** 실행할 수 있는 스레드 수는 기본 운영 체제에 의해 제한됩니다. 서버 측 애플리케이션에서는 이것이 주요 병목 현상을 유발할 수 있습니다.
*   **스레드는 항상 사용 가능한 것이 아닙니다.** JavaScript와 같은 일부 플랫폼은 스레드를 지원조차 하지 않습니다.
*   **스레드는 쉽지 않습니다.** 스레드 디버깅과 경쟁 조건(race condition) 회피는 다중 스레드 프로그래밍에서 흔히 겪는 문제입니다.

## 콜백

콜백을 사용하면, 한 함수를 다른 함수의 매개변수로 전달하고, 프로세스가 완료되면 이 함수가 호출되도록 하는 것이 아이디어입니다.

```kotlin
fun postItem(item: Item) {
    preparePostAsync { token -> 
        submitPostAsync(token, item) { post -> 
            processPost(post)
        }
    }
}

fun preparePostAsync(callback: (Token) -> Unit) {
    // make request and return immediately 
    // arrange callback to be invoked later
}
```

이것은 원칙적으로 훨씬 더 우아한 해결책처럼 느껴지지만, 다시 한번 여러 가지 문제점이 있습니다:

*   **중첩된 콜백의 어려움.** 일반적으로 콜백으로 사용되는 함수는 종종 자체 콜백을 필요로 하게 됩니다. 이는 일련의 중첩된 콜백으로 이어져 코드를 이해하기 어렵게 만듭니다. 이러한 깊이 중첩된 콜백으로 인해 들여쓰기가 삼각형 모양을 만들어서 이 패턴은 종종 콜백 지옥(callback hell) 또는 [파멸의 피라미드](https://en.wikipedia.org/wiki/Pyramid_of_doom_(programming))라고 불립니다.
*   **오류 처리가 복잡합니다.** 중첩 모델은 오류 처리 및 오류 전파를 다소 더 복잡하게 만듭니다.

콜백은 JavaScript와 같은 이벤트 루프(event-loop) 아키텍처에서 매우 흔하지만, 심지어 그곳에서도 일반적으로 사람들은 프로미스(promises)나 리액티브 확장(reactive extensions)과 같은 다른 접근 방식을 사용하는 방향으로 옮겨갔습니다.

## 퓨처, 프로미스 및 기타

퓨처(futures) 또는 프로미스(promises) (언어 또는 플랫폼에 따라 다른 용어가 사용될 수 있음) 뒤에 있는 아이디어는 우리가 호출을 할 때, 어느 시점에서 호출이 `Promise` 객체를 반환할 것이라고 _약속받으며_, 그 객체로 우리는 작업을 수행할 수 있다는 것입니다.

```kotlin
fun postItem(item: Item) {
    preparePostAsync() 
        .thenCompose { token -> 
            submitPostAsync(token, item)
        }
        .thenAccept { post -> 
            processPost(post)
        }
         
}

fun preparePostAsync(): Promise<Token> {
    // makes request and returns a promise that is completed later
    return promise 
}
```

이 접근 방식은 우리가 프로그래밍하는 방식에 일련의 변경 사항을 요구하며, 특히 다음과 같습니다:

*   **다른 프로그래밍 모델.** 콜백과 유사하게, 프로그래밍 모델은 하향식 명령형(top-down imperative) 접근 방식에서 체인 호출을 사용하는 조합형 모델(compositional model)로 바뀝니다. 루프, 예외 처리 등과 같은 전통적인 프로그램 구조는 이 모델에서 일반적으로 더 이상 유효하지 않습니다.
*   **다른 API.** 일반적으로 `thenCompose` 또는 `thenAccept`와 같은 완전히 새로운 API를 배워야 할 필요가 있으며, 이는 플랫폼마다 다를 수도 있습니다.
*   **특정 반환 타입.** 반환 타입은 우리가 필요한 실제 데이터에서 벗어나, 대신 조사해야 할 새로운 타입인 `Promise`를 반환합니다.
*   **오류 처리가 복잡할 수 있습니다.** 오류의 전파 및 연결이 항상 직관적인 것은 아닙니다.

## 리액티브 확장

리액티브 확장(Reactive Extensions, Rx)은 [에릭 마이어](https://en.wikipedia.org/wiki/Erik_Meijer_(computer_scientist))에 의해 C#에 도입되었습니다. .NET 플랫폼에서 분명히 사용되었지만, 넷플릭스가 이를 자바(Java)로 포팅하고 RxJava라고 명명하기 전까지는 주류로 채택되지 못했습니다. 그 이후로 자바스크립트(JavaScript, RxJS)를 포함한 다양한 플랫폼을 위한 수많은 포팅이 제공되었습니다.

Rx 뒤에 있는 아이디어는 `옵저버블 스트림(observable streams)`이라고 불리는 개념으로 나아가는 것입니다. 이를 통해 우리는 데이터를 스트림(무한한 양의 데이터)으로 생각하고 이 스트림을 관찰할 수 있습니다. 실용적인 관점에서, Rx는 단순히 [옵저버 패턴](https://en.wikipedia.org/wiki/Observer_pattern)에 데이터를 조작할 수 있도록 하는 일련의 확장을 더한 것입니다.

접근 방식 면에서는 퓨처(Futures)와 상당히 유사하지만, 퓨처가 개별 요소를 반환하는 반면 Rx는 스트림을 반환한다고 생각할 수 있습니다. 그러나 이전과 유사하게, 이 또한 우리의 프로그래밍 모델에 대해 완전히 새로운 사고방식을 도입하며, 다음과 같이 유명하게 표현됩니다:

    "모든 것이 스트림이며, 관찰 가능하다"
    
이는 문제를 접근하는 다른 방식과 동기 코드 작성에 익숙했던 것과는 상당히 다른 변화를 의미합니다. 퓨처와 대조적으로 한 가지 이점은 매우 많은 플랫폼으로 포팅되었기 때문에, C#, 자바, 자바스크립트 등 Rx를 사용할 수 있는 어떤 언어를 사용하든 일반적으로 일관된 API 경험을 얻을 수 있다는 것입니다.

또한, Rx는 오류 처리에 있어서 다소 더 나은 접근 방식을 도입합니다.

## 코루틴

코틀린(Kotlin)이 비동기 코드와 작업하는 방식은 코루틴(coroutines)을 사용하는 것입니다. 이는 실행을 일시 중단할 수 있는 연산이라는 아이디어, 즉 함수가 특정 시점에 실행을 일시 중단하고 나중에 다시 시작할 수 있다는 아이디어입니다.

하지만 코루틴의 이점 중 하나는 개발자 관점에서 볼 때, 논블로킹(non-blocking) 코드를 작성하는 것이 본질적으로 블로킹 코드를 작성하는 것과 같다는 것입니다. 프로그래밍 모델 자체는 크게 변하지 않습니다.

예를 들어 다음 코드를 살펴보세요:

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

이 코드는 메인 스레드를 블로킹하지 않고 장시간 실행되는 작업을 시작합니다. `preparePost`는 `sus펜드 함수(suspendable function)`라고 불리며, 따라서 `suspend` 키워드가 접두사로 붙습니다. 위에서 언급했듯이, 이는 함수가 실행되고, 실행을 일시 중지했다가 특정 시점에 다시 시작한다는 의미입니다.

*   **함수 시그니처는 완전히 동일하게 유지됩니다.** 유일한 차이점은 `suspend`가 추가된다는 것입니다. 그러나 반환 타입은 우리가 반환하고자 하는 타입입니다.
*   **코드는 여전히 동기 코드, 즉 하향식으로 작성하는 것처럼 보이며,** 코루틴을 기본적으로 시작하는 `launch`라는 함수(다른 튜토리얼에서 다룸) 외에 특별한 문법이 필요하지 않습니다.
*   **프로그래밍 모델과 API는 동일하게 유지됩니다.** 루프, 예외 처리 등을 계속 사용할 수 있으며, 완전히 새로운 API 세트를 배울 필요가 없습니다.
*   **플랫폼 독립적입니다.** JVM, 자바스크립트 또는 다른 어떤 플랫폼을 대상으로 하든, 우리가 작성하는 코드는 동일합니다. 내부적으로 컴파일러가 각 플랫폼에 맞춰 이를 조정합니다.

코루틴은 새로운 개념이 아니며, 코틀린이 발명한 것도 아닙니다. 이들은 수십 년 동안 존재해 왔으며 Go와 같은 다른 프로그래밍 언어에서 인기가 있습니다. 그러나 주목할 점은 코틀린에서 코루틴이 구현되는 방식은 대부분의 기능이 라이브러리에 위임된다는 것입니다. 실제로 `suspend` 키워드 외에는 다른 어떤 키워드도 언어에 추가되지 않습니다. 이는 구문의 일부로 `async` 및 `await`를 포함하는 C#과 같은 언어와는 다소 다릅니다. 코틀린에서는 이들이 단지 라이브러리 함수일 뿐입니다.

더 많은 정보는 [코루틴 레퍼런스](coroutines-overview.md)를 참조하세요.