[//]: # (title: 구조 분해 선언)

때로는 객체를 여러 변수로 *구조 분해(destructure)* 하는 것이 편리할 때가 있습니다. 예를 들면 다음과 같습니다:

```kotlin
val (name, age) = person 
```

이러한 구문을 *구조 분해 선언(destructuring declaration)* 이라고 부릅니다. 구조 분해 선언은 한 번에 여러 변수를 생성합니다.
여기서는 `name`과 `age`라는 두 개의 새로운 변수를 선언했으며, 이들을 독립적으로 사용할 수 있습니다:

 ```kotlin
println(name)
println(age)
```

구조 분해 선언은 컴파일 시 다음과 같은 코드로 변환됩니다:

```kotlin
val name = person.component1()
val age = person.component2()
```

`component1()`과 `component2()` 함수는 Kotlin에서 널리 사용되는 *관례(conventions) 원칙*의 또 다른 예시입니다(`+`와 `*` 같은 연산자, `for` 루프 등이 예시입니다). 
필요한 개수만큼의 component 함수를 호출할 수만 있다면 구조 분해 선언의 우변에 어떤 것이든 올 수 있습니다. 그리고 당연히 `component3()`, `component4()` 등도 가능합니다.

> `componentN()` 함수가 구조 분해 선언에서 사용되려면 `operator` 키워드가 붙어 있어야 합니다.
>
{style="note"}

구조 분해 선언은 `for` 루프에서도 작동합니다:

```kotlin
for ((a, b) in collection) { ... }
```

변수 `a`와 `b`에는 컬렉션의 요소에 대해 호출된 `component1()`과 `component2()`가 반환한 값이 할당됩니다. 

## 예제: 함수에서 두 개의 값 반환하기
 
함수에서 두 가지 결과(예: 결과 객체와 일종의 상태 값)를 반환해야 한다고 가정해 보겠습니다.
Kotlin에서 이를 수행하는 간결한 방법은 [데이터 클래스(data class)](data-classes.md)를 정의하고 그 인스턴스를 반환하는 것입니다:

```kotlin
data class Result(val result: Int, val status: Status)
fun function(...): Result {
    // 계산 수행
    
    return Result(result, status)
}

// 이제 이 함수를 사용하려면:
val (result, status) = function(...)
```

데이터 클래스는 자동으로 `componentN()` 함수를 선언하므로 구조 분해 선언을 바로 사용할 수 있습니다.

> 표준 클래스인 `Pair`를 사용하여 `function()`이 `Pair<Int, Status>`를 반환하도록 할 수도 있지만, 데이터에 적절한 이름을 부여하는 것이 더 나은 경우가 많습니다.
>
{style="note"}

## 예제: 구조 분해 선언과 맵(Map)

맵을 순회하는 가장 좋은 방법은 아마도 다음과 같을 것입니다:

```kotlin
for ((key, value) in map) {
   // 키와 값을 사용하여 작업 수행
}
```

이것이 작동하게 하려면 다음이 필요합니다:

* `iterator()` 함수를 제공하여 맵을 값의 시퀀스로 나타내야 합니다.
* 각 요소를 `component1()` 및 `component2()` 함수를 제공하여 쌍(pair)으로 나타내야 합니다.
  
실제로 표준 라이브러리는 다음과 같은 확장 기능을 제공합니다:

```kotlin
operator fun <K, V> Map<K, V>.iterator(): Iterator<Map.Entry<K, V>> = entrySet().iterator()
operator fun <K, V> Map.Entry<K, V>.component1() = getKey()
operator fun <K, V> Map.Entry<K, V>.component2() = getValue()
```

따라서 맵(데이터 클래스 인스턴스의 컬렉션 등과 마찬가지로)을 사용할 때 `for` 루프에서 구조 분해 선언을 자유롭게 사용할 수 있습니다.

## 사용하지 않는 변수에 대한 언더스코어

구조 분해 선언에서 변수가 필요하지 않은 경우, 이름 대신 언더스코어(_)를 넣을 수 있습니다:

```kotlin
val (_, status) = getResult()
```

이렇게 건너뛴 컴포넌트에 대해서는 `componentN()` 연산자 함수가 호출되지 않습니다.

## 람다에서의 구조 분해

람다 파라미터에 구조 분해 선언 구문을 사용할 수 있습니다.
람다가 `Pair` 타입(또는 `Map.Entry`나 적절한 `componentN` 함수가 있는 기타 타입)의 파라미터를 가지는 경우, 파라미터를 괄호 안에 넣어 하나 대신 여러 개의 새로운 파라미터로 대체할 수 있습니다:   

```kotlin
map.mapValues { entry -> "${entry.value}!" }
map.mapValues { (key, value) -> "$value!" }
```

파라미터 두 개를 선언하는 것과 파라미터 대신 구조 분해 쌍을 선언하는 것의 차이점에 유의하세요:  

```kotlin
{ a -> ... } // 파라미터 한 개
{ a, b -> ... } // 파라미터 두 개
{ (a, b) -> ... } // 구조 분해된 쌍(pair)
{ (a, b), c -> ... } // 구조 분해된 쌍과 또 다른 파라미터
```

구조 분해된 파라미터의 특정 컴포넌트를 사용하지 않는 경우, 이름을 지어내는 대신 언더스코어로 대체할 수 있습니다:

```kotlin
map.mapValues { (_, value) -> "$value!" }
```

전체 구조 분해 파라미터에 대한 타입을 지정하거나 특정 컴포넌트에 대해 개별적으로 타입을 지정할 수 있습니다:

```kotlin
map.mapValues { (_, value): Map.Entry<Int, String> -> "$value!" }

map.mapValues { (_, value: String) -> "$value!" }