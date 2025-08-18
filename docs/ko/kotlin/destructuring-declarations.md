[//]: # (title: 구조 분해 선언)

때로는 객체를 여러 변수로 *구조 분해*하는 것이 편리할 때가 있습니다. 예를 들어:

```kotlin
val (name, age) = person 
```

이 구문을 *구조 분해 선언*이라고 합니다. 구조 분해 선언은 한 번에 여러 변수를 생성합니다.
`name`과 `age` 두 개의 새로운 변수를 선언했으며, 이들을 개별적으로 사용할 수 있습니다:

 ```kotlin
println(name)
println(age)
```

구조 분해 선언은 다음 코드로 컴파일됩니다:

```kotlin
val name = person.component1()
val age = person.component2()
```

`component1()` 및 `component2()` 함수는 코틀린에서 널리 사용되는 *규약 원칙*의 또 다른 예시입니다 (예를 들어, `+` 및 `*`와 같은 연산자, `for` 루프를 참고하세요).
필요한 수의 컴포넌트 함수가 호출될 수 있다면, 구조 분해 선언의 오른쪽에는 무엇이든 올 수 있습니다. 그리고 물론 `component3()`, `component4()` 등도 있을 수 있습니다.

> `componentN()` 함수는 구조 분해 선언에서 사용할 수 있도록 `operator` 키워드로 표시되어야 합니다.
>
{style="note"}

구조 분해 선언은 `for` 루프에서도 작동합니다:

```kotlin
for ((a, b) in collection) { ... }
```

변수 `a`와 `b`는 컬렉션의 요소에서 호출된 `component1()` 및 `component2()` 함수에서 반환된 값을 얻습니다.

## 예시: 함수에서 두 값 반환하기

함수에서 두 가지를 반환해야 한다고 가정해 봅시다. 예를 들어, 결과 객체와 어떤 종류의 상태가 있습니다.
코틀린에서 이를 수행하는 간결한 방법은 [데이터 클래스](data-classes.md)를 선언하고 해당 인스턴스를 반환하는 것입니다:

```kotlin
data class Result(val result: Int, val status: Status)
fun function(...): Result {
    // computations
    
    return Result(result, status)
}

// Now, to use this function:
val (result, status) = function(...)
```

데이터 클래스는 `componentN()` 함수를 자동으로 선언하기 때문에, 구조 분해 선언이 여기에서 작동합니다.

> 표준 클래스 `Pair`를 사용하여 `function()`이 `Pair<Int, Status>`를 반환하도록 할 수도 있지만, 데이터에 적절한 이름을 지정하는 것이 종종 더 좋습니다.
>
{style="note"}

## 예시: 구조 분해 선언과 맵

맵을 순회하는 가장 좋은 방법은 아마도 다음과 같습니다:

```kotlin
for ((key, value) in map) {
   // do something with the key and the value
}
```

이것이 작동하도록 하려면, 다음과 같이 해야 합니다:

*   `iterator()` 함수를 제공하여 맵을 값의 시퀀스로 제공해야 합니다.
*   `component1()` 및 `component2()` 함수를 제공하여 각 요소를 쌍으로 제공해야 합니다.

실제로 표준 라이브러리는 그러한 확장 함수를 제공합니다:

```kotlin
operator fun <K, V> Map<K, V>.iterator(): Iterator<Map.Entry<K, V>> = entrySet().iterator()
operator fun <K, V> Map.Entry<K, V>.component1() = getKey()
operator fun <K, V> Map.Entry<K, V>.component2() = getValue()
```

따라서 맵과 함께 `for` 루프에서 구조 분해 선언을 자유롭게 사용할 수 있습니다 (데이터 클래스 인스턴스 컬렉션 또는 유사한 것에서도 마찬가지입니다).

## 사용하지 않는 변수에 밑줄 사용하기

구조 분해 선언에서 변수가 필요하지 않다면, 그 이름 대신 밑줄을 배치할 수 있습니다:

```kotlin
val (_, status) = getResult()
```

이러한 방식으로 건너뛴 컴포넌트에 대해서는 `componentN()` 연산자 함수가 호출되지 않습니다.

## 람다에서의 구조 분해

람다 매개변수에 구조 분해 선언 구문을 사용할 수 있습니다.
람다가 `Pair` 타입(또는 `Map.Entry`, 또는 적절한 `componentN` 함수를 가진 다른 타입)의 매개변수를 가지고 있다면, 괄호 안에 넣어 하나 대신 여러 개의 새로운 매개변수를 도입할 수 있습니다:

```kotlin
map.mapValues { entry -> "${entry.value}!" }
map.mapValues { (key, value) -> "$value!" }
```

두 개의 매개변수를 선언하는 것과 매개변수 대신 구조 분해 쌍을 선언하는 것의 차이점에 주목하세요:

```kotlin
{ a -> ... } // one parameter
{ a, b -> ... } // two parameters
{ (a, b) -> ... } // a destructured pair
{ (a, b), c -> ... } // a destructured pair and another parameter
```

구조 분해된 매개변수의 컴포넌트가 사용되지 않는다면, 이름을 지어낼 필요를 피하기 위해 밑줄로 대체할 수 있습니다:

```kotlin
map.mapValues { (_, value) -> "$value!" }
```

전체 구조 분해된 매개변수에 대해 또는 특정 컴포넌트에 대해 개별적으로 타입을 지정할 수 있습니다:

```kotlin
map.mapValues { (_, value): Map.Entry<Int, String> -> "$value!" }

map.mapValues { (_, value: String) -> "$value!" }
```