[//]: # (title: 비동기 프로그래밍 기법)

수십 년 동안 개발자들은 애플리케이션의 블로킹(blocking)을 어떻게 방지할 것인가라는 문제에 직면해 왔습니다. 데스크톱, 모바일, 심지어 서버 측 애플리케이션을 개발할 때도 사용자가 기다리게 하거나, 더 나아가 애플리케이션의 확장을 방해하는 병목 현상이 발생하는 것을 피하고 싶어 합니다.

이 문제를 해결하기 위해 다음과 같은 많은 접근 방식이 있었습니다:

* [스레딩(Threading)](#threading)
* [콜백(Callbacks)](#callbacks)
* [퓨처(Futures), 프로미스(Promises) 등](#futures-promises-and-others)
* [리액티브 확장(Reactive Extensions)](#reactive-extensions)
* [코루틴(Coroutines)](#coroutines)

코루틴이 무엇인지 설명하기 전에, 다른 솔루션들을 간략하게 살펴보겠습니다.

## 스레딩(Threading)

스레드는 애플리케이션의 블로킹을 방지하기 위해 아마도 현재까지 가장 잘 알려진 접근 방식일 것입니다.

```kotlin
fun postItem(item: Item) {
    val token = preparePost()
    val post = submitPost(token, item)
    processPost(post)
}

fun preparePost(): Token {
    // 요청을 생성하고 결과적으로 메인 스레드를 블로킹함
    return token
}
```

위 코드에서 `preparePost`가 오래 걸리는 프로세스이며 결과적으로 사용자 인터페이스를 블로킹한다고 가정해 봅시다. 우리가 할 수 있는 일은 이를 별도의 스레드에서 실행하는 것입니다. 이렇게 하면 UI가 블로킹되는 것을 피할 수 있습니다. 이는 매우 흔한 기술이지만, 일련의 단점이 있습니다:

* 스레드는 저렴하지 않습니다. 스레드는 비용이 많이 드는 컨텍스트 스위칭(context switches)을 필요로 합니다.
* 스레드는 무한하지 않습니다. 실행할 수 있는 스레드 수는 기본 운영 체제에 의해 제한됩니다. 서버 측 애플리케이션에서 이는 주요 병목 현상이 될 수 있습니다.
* 스레드를 항상 사용할 수 있는 것은 아닙니다. JavaScript와 같은 일부 플랫폼은 스레드를 아예 지원하지 않습니다.
* 스레드는 쉽지 않습니다. 스레드를 디버깅하고 경합 상태(race conditions)를 피하는 것은 멀티스레드 프로그래밍에서 겪는 흔한 문제입니다.

## 콜백(Callbacks)

콜백의 아이디어는 한 함수를 다른 함수의 파라미터로 전달하고, 프로세스가 완료되면 이 함수가 호출되도록 하는 것입니다.

```kotlin
fun postItem(item: Item) {
    preparePostAsync { token -> 
        submitPostAsync(token, item) { post -> 
            processPost(post)
        }
    }
}

fun preparePostAsync(callback: (Token) -> Unit) {
    // 요청을 만들고 즉시 반환함
    // 나중에 호출될 콜백을 정렬함
}
```

이 방식은 원칙적으로 훨씬 더 우아한 솔루션처럼 느껴지지만, 역시 몇 가지 문제가 있습니다:

* 중첩된 콜백의 어려움. 보통 콜백으로 사용되는 함수는 결국 자신만의 콜백을 필요로 하는 경우가 많습니다. 이는 이해하기 어려운 코드를 만드는 일련의 중첩된 콜백으로 이어집니다. 이 패턴은 깊게 중첩된 콜백이 만드는 들여쓰기의 삼각형 모양 때문에 종종 콜백 지옥(callback hell) 또는 [운명의 피라미드(pyramid of doom)](https://en.wikipedia.org/wiki/Pyramid_of_doom_(programming))라고 불립니다.
* 에러 처리가 복잡합니다. 중첩 모델은 에러 처리와 에러 전파를 다소 복잡하게 만듭니다.

콜백은 JavaScript와 같은 이벤트 루프 아키텍처에서 매우 흔하지만, 그곳에서도 일반적으로 사람들은 프로미스(promises)나 리액티브 확장과 같은 다른 접근 방식으로 이동했습니다.

## 퓨처(Futures), 프로미스(Promises) 등

퓨처 또는 프로미스(언어나 플랫폼에 따라 다른 용어가 사용될 수 있음) 뒤에 숨겨진 아이디어는, 호출을 할 때 언젠가 호출이 `Promise` 객체를 반환할 것임을 _약속(promised)_받고, 이후에 그 객체에 대해 작업을 수행할 수 있다는 것입니다.

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
    // 요청을 만들고 나중에 완료될 프로미스를 반환함
    return promise 
}
```

이 접근 방식은 프로그래밍 방식에 일련의 변화를 요구합니다. 특히 다음과 같습니다:

* 다른 프로그래밍 모델. 콜백과 유사하게, 프로그래밍 모델이 하향식 명령형 방식에서 체이닝된 호출을 사용하는 구성적(compositional) 모델로 이동합니다. 루프, 예외 처리 등과 같은 전통적인 프로그램 구조는 대개 이 모델에서 더 이상 유효하지 않습니다.
* 다른 API. 일반적으로 `thenCompose`나 `thenAccept`와 같이 완전히 새로운 API를 배울 필요가 있으며, 이는 플랫폼마다 다를 수도 있습니다.
* 특정 반환 타입. 반환 타입이 우리가 실제로 필요한 데이터에서 벗어나, 내부를 들여다봐야 하는 `Promise`라는 새로운 타입을 반환합니다.
* 에러 처리가 복잡할 수 있습니다. 에러의 전파와 체이닝이 항상 직관적인 것은 아닙니다.

## 리액티브 확장(Reactive extensions)

리액티브 확장(Rx)은 [Erik Meijer](https://en.wikipedia.org/wiki/Erik_Meijer_(computer_scientist))에 의해 C#에 도입되었습니다. .NET 플랫폼에서 분명히 사용되었지만, Netflix가 이를 Java로 포팅하여 RxJava라고 이름 붙이기 전까지는 주류로 채택되지 못했습니다. 그 이후로 JavaScript(RxJS)를 포함한 다양한 플랫폼을 위해 수많은 포팅 버전이 제공되었습니다.

Rx의 아이디어는 `관찰 가능한 스트림(observable streams)`이라고 불리는 방식으로 이동하는 것입니다. 여기서 우리는 데이터를 스트림(무한한 양의 데이터)으로 생각하며, 이러한 스트림을 관찰할 수 있습니다. 실질적인 측면에서 Rx는 단순히 데이터를 조작할 수 있는 일련의 확장 기능이 추가된 [옵저버 패턴(Observer Pattern)](https://en.wikipedia.org/wiki/Observer_pattern)입니다.

접근 방식 면에서 퓨처와 매우 유사하지만, 퓨처는 이산적인(discrete) 요소를 반환하는 것으로 생각할 수 있는 반면 Rx는 스트림을 반환합니다. 하지만 이전 방식들과 마찬가지로, Rx 또한 프로그래밍 모델에 대해 생각하는 완전히 새로운 방식을 도입합니다. 유명한 문구로는 다음과 같습니다.

    "모든 것은 스트림이며 관찰 가능하다"
    
이는 문제를 접근하는 다른 방식이며, 동기식 코드를 작성할 때 익숙했던 방식에서 상당히 큰 변화를 의미합니다. 퓨처와 비교했을 때 한 가지 장점은 워낙 많은 플랫폼으로 포팅되었기 때문에, C#, Java, JavaScript 또는 Rx를 사용할 수 있는 다른 어떤 언어를 사용하더라도 일반적으로 일관된 API 경험을 찾을 수 있다는 것입니다.

또한 Rx는 에러 처리에 대해 다소 더 나은 접근 방식을 도입합니다.

## 코루틴(Coroutines)

비동기 코드를 다루는 코틀린의 접근 방식은 코루틴을 사용하는 것입니다. 이는 중단 가능한 연산(suspendable computations)이라는 아이디어, 즉 함수가 어느 지점에서 실행을 중단하고 나중에 재개할 수 있다는 개념입니다.

하지만 코루틴의 장점 중 하나는 개발자 입장에서 넌블로킹(non-blocking) 코드를 작성하는 것이 본질적으로 블로킹 코드를 작성하는 것과 같다는 점입니다. 프로그래밍 모델 자체는 크게 변하지 않습니다.

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
    // 요청을 생성하고 코루틴을 중단함
    return suspendCoroutine { /* ... */ } 
}
```

이 코드는 메인 스레드를 블로킹하지 않고 오래 걸리는 작업을 실행할 것입니다. `preparePost`는 `suspendable function`이라 불리는 것이며, 따라서 앞에 `suspend` 키워드가 붙습니다. 위에서 언급했듯이 이것이 의미하는 바는 함수가 실행되고, 실행을 일시 중단했다가 특정 시점에 재개된다는 것입니다.

* 함수 시그니처는 정확히 동일하게 유지됩니다. 유일한 차이점은 `suspend`가 추가되었다는 점입니다. 하지만 반환 타입은 우리가 반환받고 싶은 타입 그대로입니다.
* 코드는 여전히 동기식 코드를 작성하는 것처럼 하향식으로 작성되며, 코루틴을 시작하는 `launch`라는 함수의 사용(다른 튜토리얼에서 다룸) 외에는 특별한 문법이 필요하지 않습니다.
* 프로그래밍 모델과 API는 동일하게 유지됩니다. 루프, 예외 처리 등을 계속 사용할 수 있으며 새로운 API 세트를 완전히 배울 필요가 없습니다.
* 플랫폼에 독립적입니다. JVM, JavaScript 또는 다른 어떤 플랫폼을 대상으로 하든 우리가 작성하는 코드는 동일합니다. 배후에서 컴파일러가 각 플랫폼에 맞게 조정하는 작업을 처리합니다.

코루틴은 새로운 개념이 아니며, 코틀린이 발명한 것은 더더욱 아닙니다. 코루틴은 수십 년 동안 존재해 왔으며 Go와 같은 일부 다른 프로그래밍 언어에서 인기가 있습니다. 다만 중요하게 주목할 점은 코틀린에서 구현된 방식은 대부분의 기능이 라이브러리에 위임되었다는 것입니다. 실제로 `suspend` 키워드 외에는 언어에 다른 키워드가 추가되지 않았습니다. 이는 문법의 일부로 `async`와 `await`를 가지고 있는 C#과 같은 언어와는 다소 다릅니다. 코틀린에서 이들은 단지 라이브러리 함수일 뿐입니다.

자세한 내용은 [코루틴 개요(Coroutines reference)](coroutines-overview.md)를 참조하세요.