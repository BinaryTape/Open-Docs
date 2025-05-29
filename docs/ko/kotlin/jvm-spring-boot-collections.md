[//]: # (title: Spring Boot 프로젝트에서 컬렉션 다루기)

<tldr>
    <p>이 문서는 **Spring Boot와 Kotlin 시작하기** 튜토리얼의 일부입니다. 계속하기 전에 이전 단계를 완료했는지 확인하세요:</p><br/>
    <p><a href="jvm-create-project-with-spring-boot.md">Kotlin으로 Spring Boot 프로젝트 생성하기</a><br/><a href="jvm-spring-boot-add-data-class.md">Spring Boot 프로젝트에 데이터 클래스 추가하기</a><br/><strong>Spring Boot 프로젝트에 데이터베이스 지원 추가</strong><br/></p>
</tldr>

이 부분에서는 Kotlin에서 컬렉션에 대한 다양한 연산을 수행하는 방법을 배웁니다.
대부분의 경우 SQL이 필터링 및 정렬과 같은 데이터 연산을 도울 수 있지만, 실제 애플리케이션에서는 데이터를 조작하기 위해 컬렉션과 함께 작업해야 하는 경우가 많습니다.

아래에서는 데모 애플리케이션에 이미 존재하는 데이터 객체를 기반으로 컬렉션 작업을 위한 몇 가지 유용한 기법을 찾을 수 있습니다.
모든 예시에서는 `service.findMessages()` 함수를 호출하여 데이터베이스에 저장된 모든 메시지를 검색하는 것으로 시작한 다음, 메시지 목록을 필터링, 정렬, 그룹화 또는 변환하는 다양한 연산을 수행한다고 가정합니다.

## 요소 검색

Kotlin 컬렉션은 컬렉션에서 단일 요소를 검색하기 위한 일련의 함수를 제공합니다.
컬렉션에서 단일 요소는 위치 또는 일치하는 조건에 따라 검색할 수 있습니다.

예를 들어, 컬렉션의 첫 번째 및 마지막 요소를 검색하는 것은 해당 함수인 `first()`와 `last()`를 통해 가능합니다.

```kotlin
@GetMapping("/firstAndLast")
fun firstAndLast(): List<Message> {
    val messages = service.findMessages()
    return listOf(messages.first(), messages.last())
}
```

위 예시에서는 컬렉션의 첫 번째와 마지막 요소를 검색하여 JSON 문서로 직렬화될 두 개의 요소로 구성된 새 목록을 생성합니다.

특정 위치의 요소를 검색하려면 [`elementAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at.html) 함수를 사용할 수 있습니다.

`first()`와 `last()` 함수는 모두 주어진 조건(predicate)과 일치하는 요소를 컬렉션에서 검색할 수 있도록 해줍니다.
예를 들어, 메시지 길이가 10자보다 긴 목록의 첫 번째 `Message` 인스턴스를 찾는 방법은 다음과 같습니다:

```kotlin
@GetMapping("/firstMessageLongerThan10")
fun firstMessageLongerThan10(): Message {
    val messages = service.findMessages()
    return messages.first { it.text.length > 10 }
}
```

물론, 주어진 문자 제한보다 긴 메시지가 없는 경우도 있을 수 있습니다.
이 경우, 위의 코드는 `NoSuchElementException`을 발생시킵니다.
대안으로, 컬렉션에 일치하는 요소가 없는 경우 null을 반환하도록 `firstOrNull()` 함수를 사용할 수 있습니다.
그때는 결과가 null인지 아닌지를 확인하는 것이 프로그래머의 책임입니다:

```kotlin
@GetMapping("/retrieveFirstMessageLongerThan10")
fun firstMessageOrNull(): Message {
    val messages = service.findMessages()
    return messages.firstOrNull { 
        it.text.length > 10 
    } ?: Message(null, "Default message")
}

```

## 요소 필터링

_필터링_은 컬렉션 처리에서 가장 인기 있는 작업 중 하나입니다.
표준 라이브러리는 단일 호출로 컬렉션을 필터링할 수 있는 확장 함수(extension functions) 그룹을 포함하고 있습니다.
이 함수들은 원본 컬렉션을 변경하지 않고 필터링된 요소로 구성된 새 컬렉션을 생성합니다.

```kotlin
@GetMapping("/filterMessagesLongerThan10")
fun filterMessagesLongerThan10(): List<Message> {
    val messages = service.findMessages()
    return messages.filter { it.text.length > 10 }
}
```

이 코드는 `first()` 함수를 사용하여 텍스트 길이가 10보다 큰 단일 요소를 찾았던 예시와 매우 유사합니다.
차이점은 `filter()`가 조건과 일치하는 요소들의 목록을 반환한다는 것입니다.

## 요소 정렬

요소의 순서는 특정 컬렉션 타입의 중요한 측면입니다.
Kotlin의 표준 라이브러리는 자연 정렬, 사용자 지정 정렬, 역순 정렬, 무작위 정렬 등 다양한 방식으로 정렬하기 위한 여러 함수를 제공합니다.

예를 들어, 목록에 있는 메시지를 마지막 글자를 기준으로 정렬해 봅시다.
이것은 컬렉션 객체에서 필요한 값을 추출하는 셀렉터(selector)를 사용하는 `sortedBy()` 함수를 통해 가능합니다.
목록의 요소 비교는 추출된 값을 기반으로 이루어집니다.

```kotlin
@GetMapping("/sortByLastLetter")
fun sortByLastLetter(): List<Message> {
    val messages = service.findMessages()
    return messages.sortedBy { it.text.last() }
}
```

## 요소 그룹화

그룹화는 요소들이 어떻게 함께 그룹화되어야 하는지에 대한 다소 복잡한 로직을 구현해야 할 수 있습니다.
[`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html) 함수는 람다(lambda)를 인자로 받아 `Map`을 반환합니다.
이 맵에서 각 키는 람다 결과이며, 해당 값은 이 결과가 반환된 요소들의 `List`입니다.

예를 들어, "hello"와 "bye"와 같은 특정 단어와 일치시켜 메시지를 그룹화해 봅시다.
메시지 텍스트에 제공된 단어 중 어떤 것도 포함되어 있지 않다면, "other"라는 별도의 그룹에 추가합니다.

```kotlin
@GetMapping("/groups")
fun groups(): Map<String, List<Message>> {
    val messages = service.findMessages()
    val groups = listOf("hello", "bye")

    val map = messages.groupBy { message ->
        groups.firstOrNull {
            message.text.contains(it, ignoreCase = true)
        } ?: "other"
    }

    return map
}
```

## 변환 연산

컬렉션에서 흔히 수행하는 작업은 컬렉션 요소를 한 타입에서 다른 타입으로 변환하는 것입니다.
물론, Kotlin 표준 라이브러리는 이러한 작업을 위한 여러 [변환 함수](collection-transformations.md)를 제공합니다.

예를 들어, `Message` 객체 목록을 메시지의 `id`와 `text` 본문을 연결하여 구성된 `String` 객체 목록으로 변환해 봅시다.
이를 위해, 주어진 람다 함수를 각 후속 요소에 적용하고 람다 결과 목록을 반환하는 `map()` 함수를 사용할 수 있습니다.

```kotlin
@GetMapping("/transformMessagesToListOfStrings")
fun transformMessagesToListOfStrings(): List<String> {
    val messages = service.findMessages()
    return messages.map { "${it.id} ${it.text}" }
}
```

## 집계 연산

집계 연산은 값들의 컬렉션에서 단일 값을 계산합니다.
집계 연산의 한 예시는 모든 메시지 길이의 평균을 계산하는 것입니다.

```kotlin
@GetMapping("/averageMessageLength")
fun averageMessageLength(): Double {
    val messages = service.findMessages()
    return messages.map { it.text.length }.average()
}
```

먼저, `map()` 함수를 사용하여 메시지 목록을 각 메시지의 길이를 나타내는 값 목록으로 변환합니다.
그런 다음 평균 함수를 사용하여 최종 결과를 계산할 수 있습니다.

다른 집계 함수 예시로는 `min()`, `max()`, `sum()`, `count()`가 있습니다.

더 구체적인 경우를 위해, 제공된 연산을 컬렉션 요소에 순차적으로 적용하고 누적된 결과를 반환하는 [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html) 및 [`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html) 함수가 있습니다.

예를 들어, 가장 긴 텍스트를 가진 메시지를 찾아봅시다.

```kotlin
@GetMapping("findTheLongestMessage")
fun reduce(): Message {
    val messages = service.findMessages()
    return messages.reduce { first, second ->
        if (first.text.length > second.text.length) first else second
    }
}
```

## 다음 단계

[다음 섹션](jvm-spring-boot-using-crudrepository.md)으로 이동하세요.