[//]: # (title: 타입 검사 및 캐스트)

Kotlin에서는 런타임에 객체의 타입을 확인하기 위해 타입 검사를 수행할 수 있습니다. 타입 캐스트를 사용하면 객체를 다른 타입으로 변환할 수 있습니다.

> **제네릭스** 타입 검사 및 캐스트에 대해 자세히 알아보려면, 예를 들어 `List<T>`, `Map<K,V>` 등은 [제네릭스 타입 검사 및 캐스트](generics.md#generics-type-checks-and-casts)를 참조하세요.
>
{style="tip"}

## `is` 및 `!is` 연산자

객체가 주어진 타입에 부합하는지 런타임 검사를 수행하려면 `is` 연산자 또는 그 부정 형태인 `!is`를 사용합니다:

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

대부분의 경우, 컴파일러가 객체를 자동으로 캐스트해주기 때문에 명시적인 캐스트 연산자를 사용할 필요가 없습니다. 이를 스마트 캐스팅이라고 합니다. 컴파일러는 변경 불가능한 값에 대한 타입 검사 및 [명시적 캐스트](#unsafe-cast-operator)를 추적하고, 필요할 때 자동으로 암시적(안전한) 캐스트를 삽입합니다:

```kotlin
fun demo(x: Any) {
    if (x is String) {
        print(x.length) // x is automatically cast to String
    }
}
```

컴파일러는 심지어 부정 검사가 반환으로 이어지는 경우에도 캐스트가 안전하다는 것을 알 만큼 스마트합니다:

```kotlin
if (x !is String) return

print(x.length) // x is automatically cast to String
```

### 제어 흐름

스마트 캐스트는 `if` 조건식뿐만 아니라 [`when` 표현식](control-flow.md#when-expressions-and-statements) 및 [`while` 루프](control-flow.md#while-loops)에서도 작동합니다:

```kotlin
when (x) {
    is Int -> print(x + 1)
    is String -> print(x.length + 1)
    is IntArray -> print(x.sum())
}
```

`if`, `when`, 또는 `while` 조건에서 변수를 사용하기 전에 `Boolean` 타입의 변수를 선언하면, 컴파일러가 변수에 대해 수집한 모든 정보가 스마트 캐스팅을 위해 해당 블록에서 접근 가능해집니다.

이는 불리언 조건을 변수로 추출하는 것과 같은 작업을 수행하고 싶을 때 유용할 수 있습니다. 이렇게 하면 변수에 의미 있는 이름을 부여하여 코드 가독성을 높이고 나중에 코드에서 변수를 재사용할 수 있습니다. 예를 들어:

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
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-local-variables" validate="false"}

### 논리 연산자

컴파일러는 `&&` 또는 `||` 연산자의 왼쪽 편에 타입 검사(일반 또는 부정)가 있는 경우 오른쪽 편에서 스마트 캐스트를 수행할 수 있습니다:

```kotlin
// x is automatically cast to String on the right-hand side of `||`
if (x !is String || x.length == 0) return

// x is automatically cast to String on the right-hand side of `&&`
if (x is String && x.length > 0) {
    print(x.length) // x is automatically cast to String
}
```

객체에 대한 타입 검사를 `or` 연산자(`||`)와 결합하면, 가장 가까운 공통 상위 타입으로 스마트 캐스트됩니다:

```kotlin
interface Status {
    fun signal() {}
}

interface Ok : Status
interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // signalStatus is smart-cast to a common supertype Status
        signalStatus.signal()
    }
}
```

> 공통 상위 타입은 [유니온 타입](https://en.wikipedia.org/wiki/Union_type)의 **근사치**입니다. 유니온 타입은 [현재 Kotlin에서 지원되지 않습니다](https://youtrack.jetbrains.com/issue/KT-13108/Denotable-union-and-intersection-types).
>
{style="note"}

### 인라인 함수

컴파일러는 [인라인 함수](inline-functions.md)에 전달되는 람다 함수 내에 캡처된 변수를 스마트 캐스트할 수 있습니다.

인라인 함수는 암시적인 [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html) 계약을 가진 것으로 처리됩니다. 이는 인라인 함수에 전달된 모든 람다 함수가 제자리에서 호출됨을 의미합니다. 람다 함수가 제자리에서 호출되므로, 컴파일러는 람다 함수가 해당 함수 본문에 포함된 어떤 변수에 대한 참조도 유출할 수 없다는 것을 압니다.

컴파일러는 이 지식과 다른 분석을 사용하여 캡처된 변수 중 스마트 캐스트가 안전한지 여부를 결정합니다. 예를 들어:

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () -> Unit) = f()

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

스마트 캐스트 정보는 `catch` 및 `finally` 블록으로 전달됩니다. 이는 컴파일러가 객체가 널 허용 타입인지 추적하므로 코드를 더 안전하게 만듭니다. 예를 들어:

```kotlin
//sampleStart
fun testString() {
    var stringInput: String? = null
    // stringInput is smart-cast to String type
    stringInput = ""
    try {
        // The compiler knows that stringInput isn't null
        println(stringInput.length)
        // 0

        // The compiler rejects previous smart cast information for 
        // stringInput. Now stringInput has the String? type.
        stringInput = null

        // Trigger an exception
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // The compiler knows stringInput can be null
        // so stringInput stays nullable.
        println(stringInput?.length)
        // null
    }
}
//sampleEnd
fun main() {
    testString()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-exception-handling"}

### 스마트 캐스트 전제 조건

> 스마트 캐스트는 컴파일러가 검사와 사용 사이에 변수가 변경되지 않을 것이라고 보장할 수 있을 때만 작동합니다.
>
{style="warning"}

스마트 캐스트는 다음 조건에서 사용할 수 있습니다:

<table style="none">
    <tr>
        <td>
            <code>val</code> 로컬 변수
        </td>
        <td>
            [로컬 위임 속성](delegated-properties.md)을 제외하고 항상 가능합니다.
        </td>
    </tr>
    <tr>
        <td>
            <code>val</code> 속성
        </td>
        <td>
            속성이 <code>private</code>, <code>internal</code>이거나, 속성이 선언된 동일한 [모듈](visibility-modifiers.md#modules) 내에서 검사가 수행되는 경우. <code>open</code> 속성 또는 사용자 지정 getter를 가진 속성에는 스마트 캐스트를 사용할 수 없습니다.
        </td>
    </tr>
    <tr>
        <td>
            <code>var</code> 로컬 변수
        </td>
        <td>
            변수가 검사와 사용 사이에 수정되지 않고, 변수를 수정하는 람다에 캡처되지 않았으며, 로컬 위임 속성이 아닌 경우.
        </td>
    </tr>
    <tr>
        <td>
            <code>var</code> 속성
        </td>
        <td>
            변수가 언제든지 다른 코드에 의해 수정될 수 있으므로 불가능합니다.
        </td>
    </tr>
</table>

## "안전하지 않은" 캐스트 연산자

객체를 널 불허 타입으로 명시적으로 캐스트하려면 *안전하지 않은* 캐스트 연산자 `as`를 사용합니다:

```kotlin
val x: String = y as String
```

캐스트가 불가능하면 컴파일러는 예외를 발생시킵니다. 그래서 _안전하지 않다고_ 불립니다.

위 예제에서 `y`가 `null`이면 위의 코드도 예외를 발생시킵니다. 이는 `String`이 [널 허용](null-safety.md)이 아니므로 `null`을 `String`으로 캐스트할 수 없기 때문입니다. null이 될 수 있는 값에 대해 예제가 작동하도록 하려면 캐스트의 오른쪽 편에 널 허용 타입을 사용합니다:

```kotlin
val x: String? = y as String?
```

## "안전한" (널 허용) 캐스트 연산자

예외를 피하려면 실패 시 `null`을 반환하는 *안전한* 캐스트 연산자 `as?`를 사용합니다.

```kotlin
val x: String? = y as? String
```

`as?`의 오른쪽 편이 널 불허 타입인 `String`임에도 불구하고, 캐스트 결과는 널 허용이라는 점에 유의하세요.