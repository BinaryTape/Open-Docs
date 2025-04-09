---
title: "형식 검사 및 캐스팅"
---
Kotlin에서는 런타임 시 객체의 타입을 확인하기 위해 타입 검사를 수행할 수 있습니다. 타입 캐스트를 사용하면 객체를 다른 타입으로 변환할 수 있습니다.

:::note
**제네릭** 타입 검사 및 캐스트, 예를 들어 `List<T>`, `Map<K,V>`에 대해 자세히 알아보려면 [제네릭 타입 검사 및 캐스트](generics#generics-type-checks-and-casts)를 참조하세요.

## is 및 !is 연산자

객체가 주어진 타입을 준수하는지 식별하는 런타임 검사를 수행하려면 `is` 연산자 또는 부정 형태인 `!is`를 사용하세요.

```kotlin
if (obj is String) {
    print(obj.length)
}

if (obj !is String) { // Same as !(obj is String)
    print("Not a String")
} else {
    print(obj.length)
}
```

## 스마트 캐스트

대부분의 경우 컴파일러가 자동으로 객체를 캐스팅하므로 명시적 캐스트 연산자를 사용할 필요가 없습니다. 이를 스마트 캐스팅이라고 합니다. 컴파일러는 변경 불가능한 값에 대한 타입 검사 및 [명시적 캐스트](#unsafe-cast-operator)를 추적하고 필요할 때 암시적 (안전한) 캐스트를 자동으로 삽입합니다.

```kotlin
fun demo(x: Any) {
    if (x is String) {
        print(x.length) // x는 자동으로 String으로 캐스팅됩니다.
    }
}
```

컴파일러는 부정 검사가 반환으로 이어지는 경우 캐스트가 안전하다는 것을 알 수 있을 정도로 똑똑합니다.

```kotlin
if (x !is String) return

print(x.length) // x는 자동으로 String으로 캐스팅됩니다.
```

### 제어 흐름

스마트 캐스트는 `if` 조건식뿐만 아니라 [`when` 식](control-flow#when-expressions-and-statements) 및 [`while` 루프](control-flow#while-loops)에서도 작동합니다.

```kotlin
when (x) {
    is Int `->` print(x + 1)
    is String `->` print(x.length + 1)
    is IntArray `->` print(x.sum())
}
```

`if`, `when` 또는 `while` 조건에서 사용하기 전에 `Boolean` 타입의 변수를 선언하면 컴파일러가 변수에 대해 수집한 모든 정보는 해당 블록에서 스마트 캐스팅을 위해 액세스할 수 있습니다.

이는 부울 조건을 변수로 추출하는 것과 같은 작업을 수행하려는 경우에 유용할 수 있습니다. 그런 다음 변수에 의미 있는 이름을 지정하여 코드 가독성을 향상시키고 나중에 코드에서 변수를 재사용할 수 있습니다. 예를 들어:

```kotlin
class Cat {
    fun purr() {
        println("Purr purr")
    }
}

fun petAnimal(animal: Any) {
    val isCat = animal is Cat
    if (isCat) {
        // The compiler can access information about
        // isCat, so it knows that animal was smart-cast
        // to the type Cat.
        // Therefore, the purr() function can be called.
        animal.purr()
    }
}

fun main(){
    val kitty = Cat()
    petAnimal(kitty)
    // Purr purr
}
```

### 논리 연산자

컴파일러는 왼쪽 편에 타입 검사(정규 또는 부정)가 있는 경우 `&&` 또는 `||` 연산자의 오른쪽에 스마트 캐스트를 수행할 수 있습니다.

```kotlin
// x는 `||`의 오른쪽에서 자동으로 String으로 캐스팅됩니다.
if (x !is String || x.length == 0) return

// x는 `&&`의 오른쪽에서 자동으로 String으로 캐스팅됩니다.
if (x is String && x.length > 0) {
    print(x.length) // x는 자동으로 String으로 캐스팅됩니다.
}
```

객체에 대한 타입 검사를 `or` 연산자(`||`)와 결합하면 스마트 캐스트가 가장 가까운 공통 슈퍼타입으로 수행됩니다.

```kotlin
interface Status {
    fun signal() {}
}

interface Ok : Status
interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // signalStatus는 공통 슈퍼타입 Status로 스마트 캐스팅됩니다.
        signalStatus.signal()
    }
}
```

공통 슈퍼타입은 [유니온 타입](https://en.wikipedia.org/wiki/Union_type)의 **근사치**입니다. 유니온 타입은 [현재 Kotlin에서 지원되지 않습니다](https://youtrack.jetbrains.com/issue/KT-13108/Denotable-union-and-intersection-types).

:::

### 인라인 함수

컴파일러는 [인라인 함수](inline-functions)에 전달되는 람다 함수 내에서 캡처된 변수를 스마트 캐스팅할 수 있습니다.

인라인 함수는 암시적 [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html) 계약을 가진 것으로 취급됩니다. 즉, 인라인 함수에 전달되는 람다 함수는 제자리에서 호출됩니다. 람다 함수는 제자리에서 호출되므로 컴파일러는 람다 함수가 함수 본문에 포함된 변수에 대한 참조를 유출할 수 없다는 것을 알고 있습니다.

컴파일러는 이 지식과 다른 분석을 사용하여 캡처된 변수를 스마트 캐스팅하는 것이 안전한지 여부를 결정합니다. 예를 들어:

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () `->` Unit) = f()

fun nextProcessor(): Processor? = null

fun runProcessor(): Processor? {
    var processor: Processor? = null
    inlineAction {
        // The compiler knows that processor is a local variable and inlineAction()
        // is an inline function, so references to processor can't be leaked.
        // Therefore, it's safe to smart-cast processor.
      
        // If processor isn't null, processor is smart-cast
        if (processor != null) {
            // The compiler knows that processor isn't null, so no safe call 
            // is needed
            processor.process()
        }

        processor = nextProcessor()
    }

    return processor
}
```

### 예외 처리

스마트 캐스트 정보는 `catch` 및 `finally` 블록으로 전달됩니다. 이렇게 하면 컴파일러가 객체가 nullable 타입인지 여부를 추적하므로 코드가 더 안전해집니다. 예를 들어:

```kotlin

fun testString() {
    var stringInput: String? = null
    // stringInput은 String 타입으로 스마트 캐스팅됩니다.
    stringInput = ""
    try {
        // 컴파일러는 stringInput이 null이 아님을 알고 있습니다.
        println(stringInput.length)
        // 0

        // 컴파일러는 stringInput에 대한 이전 스마트 캐스트 정보를 거부합니다.
        // 이제 stringInput은 String? 타입을 가집니다.
        stringInput = null

        // 예외 발생
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // 컴파일러는 stringInput이 null일 수 있음을 알고 있습니다.
        // 따라서 stringInput은 nullable로 유지됩니다.
        println(stringInput?.length)
        // null
    }
}

fun main() {
    testString()
}
```

### 스마트 캐스트 전제 조건

:::caution
스마트 캐스트는 컴파일러가 검사와 사용 사이에 변수가 변경되지 않는다는 것을 보장할 수 있는 경우에만 작동합니다.

:::

스마트 캐스트는 다음 조건에서 사용할 수 있습니다.
<table >
<tr>
<td>

            `val` 지역 변수
</td>
<td>

            <a href="delegated-properties">지역 위임 속성</a>을 제외하고 항상 가능합니다.
</td>
</tr>
<tr>
<td>

            `val` 속성
</td>
<td>

            속성이 `private`, `internal`이거나 검사가 속성이 선언된 동일한 <a href="visibility-modifiers#modules">모듈</a>에서 수행되는 경우. 스마트 캐스트는 `open` 속성 또는 사용자 정의 getter가 있는 속성에서는 사용할 수 없습니다.
</td>
</tr>
<tr>
<td>

            `var` 지역 변수
</td>
<td>

            변수가 검사와 사용 사이에 수정되지 않고, 수정하는 람다에서 캡처되지 않으며, 지역 위임 속성이 아닌 경우.
</td>
</tr>
<tr>
<td>

            `var` 속성
</td>
<td>

            다른 코드에서 언제든지 변수를 수정할 수 있으므로 절대 불가능합니다.
</td>
</tr>
</table>

## "안전하지 않은" 캐스트 연산자

객체를 non-nullable 타입으로 명시적으로 캐스팅하려면 *안전하지 않은* 캐스트 연산자 `as`를 사용하십시오.

```kotlin
val x: String = y as String
```

캐스트가 불가능하면 컴파일러는 예외를 발생시킵니다. 이것이 _안전하지 않음_이라고 불리는 이유입니다.

이전 예제에서 `y`가 `null`이면 위의 코드도 예외를 발생시킵니다. 이는 `String`이 [nullable](null-safety)이 아니므로 `null`을 `String`으로 캐스팅할 수 없기 때문입니다. 가능한 null 값에 대해 예제가 작동하도록 하려면 캐스트의 오른쪽에 nullable 타입을 사용하세요.

```kotlin
val x: String? = y as String?
```

## "안전한" (nullable) 캐스트 연산자

예외를 피하려면 실패 시 `null`을 반환하는 *안전한* 캐스트 연산자 `as?`를 사용하십시오.

```kotlin
val x: String? = y as? String
```

`as?`의 오른쪽이 non-nullable 타입인 `String`임에도 불구하고 캐스트 결과는 nullable입니다.