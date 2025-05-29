[//]: # (title: 비동기 프로그래밍 기법)

수십 년 동안 개발자로서 우리는 애플리케이션이 블로킹되는 것을 방지하는 방법이라는 문제에 직면해 왔습니다. 데스크톱, 모바일, 심지어 서버 측 애플리케이션을 개발하든, 우리는 사용자를 기다리게 하거나 더 심하게는 애플리케이션의 확장을 방해하는 병목 현상을 유발하는 것을 피하고 싶습니다.

이 문제를 해결하기 위한 많은 접근 방식이 있었습니다. 여기에는 다음이 포함됩니다.

* [스레딩](#threading)
* [콜백](#callbacks)
* [퓨처, 프로미스 및 기타](#futures-promises-and-others)
* [리액티브 확장](#reactive-extensions)
* [코루틴](#coroutines)

코루틴이 무엇인지 설명하기 전에 다른 해결책들을 간략히 살펴보겠습니다.

## 스레딩

스레드는 애플리케이션이 블로킹되는 것을 방지하기 위한 가장 잘 알려진 접근 방식일 것입니다.

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

위 코드에서 `preparePost`가 장시간 실행되는 프로세스이며 결과적으로 사용자 인터페이스를 블로킹한다고 가정해 봅시다. 우리가 할 수 있는 일은 이를 별도의 스레드에서 실행하는 것입니다. 이렇게 하면 UI가 블로킹되는 것을 피할 수 있습니다. 이는 매우 흔한 기술이지만, 다음과 같은 일련의 단점이 있습니다.

* 스레드는 저렴하지 않습니다. 스레드는 비용이 많이 드는 컨텍스트 스위치를 필요로 합니다.
* 스레드는 무한하지 않습니다. 실행할 수 있는 스레드 수는 기본 운영 체제에 의해 제한됩니다. 서버 측 애플리케이션에서는 이것이 주요 병목 현상을 유발할 수 있습니다.
* 스레드는 항상 사용 가능한 것은 아닙니다. JavaScript와 같은 일부 플랫폼은 스레드를 지원하지도 않습니다.
* 스레드는 쉽지 않습니다. 스레드를 디버깅하고 경쟁 상태를 피하는 것은 다중 스레드 프로그래밍에서 흔히 겪는 문제입니다.

## 콜백

콜백은 하나의 함수를 다른 함수의 매개변수로 전달하고, 해당 프로세스가 완료되면 이 함수가 호출되도록 하는 아이디어입니다.

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

이는 원칙적으로 훨씬 더 우아한 해결책처럼 느껴지지만, 다시 한번 여러 가지 문제가 있습니다.

* 중첩 콜백의 어려움. 일반적으로 콜백으로 사용되는 함수는 종종 자체 콜백을 필요로 하게 됩니다. 이는 이해하기 어려운 코드로 이어지는 일련의 중첩 콜백을 야기합니다. 이 패턴은 깊이 중첩된 콜백으로 인한 들여쓰기가 삼각형 모양을 만들기 때문에 종종 콜백 지옥(callback hell) 또는 [피라미드 오브 둠(pyramid of doom)](https://en.wikipedia.org/wiki/Pyramid_of_doom_(programming))이라고 불립니다.
* 오류 처리가 복잡합니다. 중첩 모델은 오류 처리 및 오류 전파를 다소 더 복잡하게 만듭니다.

콜백은 JavaScript와 같은 이벤트 루프(event-loop) 아키텍처에서 매우 흔하지만, 심지어 그곳에서도 일반적으로 사람들은 프로미스(promises)나 리액티브 확장(reactive extensions)과 같은 다른 접근 방식을 사용하도록 전환했습니다.

## 퓨처, 프로미스 및 기타

퓨처 또는 프로미스(언어나 플랫폼에 따라 다른 용어가 사용될 수 있음)의 아이디어는 우리가 호출을 할 때, 언젠가 해당 호출이 `Promise` 객체를 반환할 것이라고 '약속'받으며, 그 객체를 사용하여 추가 작업을 수행할 수 있다는 것입니다.

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

이 접근 방식은 특히 프로그래밍 방식에 일련의 변화를 요구합니다.

* 다른 프로그래밍 모델. 콜백과 유사하게, 프로그래밍 모델은 하향식 명령형 접근 방식에서 체인형 호출(chained calls)을 사용하는 구성형 모델로 전환됩니다. 루프, 예외 처리 등과 같은 전통적인 프로그램 구조는 일반적으로 이 모델에서는 더 이상 유효하지 않습니다.
* 다른 API. 일반적으로 `thenCompose` 또는 `thenAccept`와 같이 완전히 새로운 API를 배워야 하며, 이는 플랫폼마다 다를 수 있습니다.
* 특정 반환 타입. 반환 타입은 우리가 필요한 실제 데이터에서 벗어나, 대신 조사해야 하는 새로운 타입인 `Promise`를 반환합니다.
* 오류 처리가 복잡할 수 있습니다. 오류의 전파 및 체인 연결이 항상 간단하지는 않습니다.

## 리액티브 확장

리액티브 확장(Reactive Extensions, Rx)은 [에릭 마이어(Erik Meijer)](https://en.wikipedia.org/wiki/Erik_Meijer_(computer_scientist))에 의해 C#에 도입되었습니다. .NET 플랫폼에서 분명히 사용되었지만, 넷플릭스가 이를 자바(Java)로 포팅하고 RxJava라고 명명하기 전까지는 주류 채택에 이르지 못했습니다. 그 이후로 자바스크립트(JavaScript, RxJS)를 포함한 다양한 플랫폼을 위한 수많은 포팅이 제공되었습니다.

Rx의 아이디어는 `옵저버블 스트림(observable streams)`이라고 불리는 개념으로 나아가는 것입니다. 이를 통해 우리는 데이터를 스트림(무한한 양의 데이터)으로 생각하고, 이 스트림을 관찰할 수 있습니다. 실제적으로 Rx는 단순히 데이터를 조작할 수 있는 일련의 확장이 추가된 [옵저버 패턴(Observer Pattern)](https://en.wikipedia.org/wiki/Observer_pattern)입니다.

접근 방식은 퓨처(Futures)와 상당히 유사하지만, 퓨처를 개별 요소를 반환하는 것으로 생각할 수 있는 반면 Rx는 스트림을 반환합니다. 하지만 이전과 마찬가지로, 이는 우리의 프로그래밍 모델에 대한 완전히 새로운 사고방식을 도입하며, 유명하게 다음과 같이 표현되었습니다.

    "모든 것은 스트림이며, 관찰 가능하다"

이는 문제를 접근하는 다른 방식과 동기 코드를 작성할 때 익숙했던 방식에서 상당히 큰 변화를 의미합니다. 퓨처와 대조적인 한 가지 이점은, Rx가 매우 많은 플랫폼으로 포팅되었기 때문에 C#, 자바(Java), 자바스크립트(JavaScript) 또는 Rx를 사용할 수 있는 다른 어떤 언어를 사용하든 일관된 API 경험을 일반적으로 찾을 수 있다는 점입니다.

또한, Rx는 오류 처리에 대해 다소 더 나은 접근 방식을 도입합니다.

## 코루틴

코틀린(Kotlin)이 비동기 코드를 다루는 접근 방식은 코루틴(coroutines)을 사용하는 것인데, 이는 일시 중단 가능한 연산(suspendable computations)의 아이디어, 즉 함수가 어떤 시점에서 실행을 일시 중단하고 나중에 다시 시작할 수 있다는 아이디어입니다.

하지만 코루틴의 장점 중 하나는 개발자 입장에서 논블로킹(non-blocking) 코드를 작성하는 것이 본질적으로 블로킹(blocking) 코드를 작성하는 것과 같다는 것입니다. 프로그래밍 모델 자체는 크게 변하지 않습니다.

예를 들어 다음 코드를 살펴보세요.

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

이 코드는 메인 스레드를 블로킹하지 않고 장시간 실행되는 작업을 시작합니다. `preparePost`는 `일시 중단 가능한 함수(suspendable function)`라고 불리며, 따라서 `suspend` 키워드가 앞에 붙습니다. 위에 언급된 바와 같이, 이는 함수가 실행되다가 잠시 멈춘 후 특정 시점에 다시 실행을 재개한다는 의미입니다.

* 함수 시그니처는 정확히 동일하게 유지됩니다. 유일한 차이점은 `suspend`가 추가된다는 것입니다. 하지만 반환 타입은 우리가 반환받고자 하는 타입입니다.
* 코드는 여전히 동기 코드를 작성하는 것처럼, 위에서 아래로 작성되며, 코루틴을 본질적으로 시작하는 `launch`라는 함수(다른 튜토리얼에서 다룸)의 사용 외에는 특별한 문법이 필요하지 않습니다.
* 프로그래밍 모델과 API는 동일하게 유지됩니다. 루프, 예외 처리 등을 계속 사용할 수 있으며, 새로운 API 세트를 완전히 배울 필요가 없습니다.
* 플랫폼 독립적입니다. JVM, JavaScript 또는 다른 어떤 플랫폼을 대상으로 하든 우리가 작성하는 코드는 동일합니다. 내부적으로 컴파일러가 각 플랫폼에 맞게 조정하는 역할을 합니다.

코루틴은 코틀린이 발명한 것은 물론이고, 새로운 개념도 아닙니다. 이들은 수십 년 동안 존재했으며, 고(Go)와 같은 다른 프로그래밍 언어에서도 인기가 있습니다. 하지만 중요한 점은 코틀린에서 코루틴이 구현되는 방식인데, 대부분의 기능이 라이브러리에 위임된다는 것입니다. 사실, `suspend` 키워드 외에는 다른 키워드가 언어에 추가되지 않습니다. 이는 `async`와 `await`가 문법의 일부로 포함된 C#과 같은 언어와는 다소 다릅니다. 코틀린에서는 이들이 단지 라이브러리 함수일 뿐입니다.

더 자세한 정보는 [코루틴 레퍼런스](coroutines-overview.md)를 참조하세요.