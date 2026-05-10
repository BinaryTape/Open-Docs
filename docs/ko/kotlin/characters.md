[//]: # (title: 문자)
[//]: # (description: Kotlin의 Char 타입 사용법(구문, 유니코드 지원, 이스케이프 시퀀스, 일반적인 문자 연산 등)을 알아봅니다.)

[`Char`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-char/) 타입은 단일 문자를 UTF-16 코드 단위로 표현합니다.

글자, 숫자, 문장 부호 또는 공백과 같은 개별 문자 값에는 `Char`를 사용하세요. 문자 시퀀스에는 [`String`](strings.md)을 사용합니다.

> `Char`는 숫자 타입이 아니지만, 각 문자는 접근 가능한 유니코드 숫자 값을 가집니다. 
> [](#character-conversion)을 참조하세요.
> 
{style="tip"}

## 구문

문자를 선언하려면 값을 작은따옴표(`' '`)로 감쌉니다. `Char` 타입을 명시적으로 지정하거나 Kotlin이 값으로부터 타입을 추론하게 할 수 있습니다.

```kotlin
val letter: Char = 'a'

// Kotlin은 값이 작은따옴표로 작성되었으므로 Char로 추론합니다
val digit = '1'
val symbol = '!'
val space = ' '
val separator = ':'
```

문자 리터럴은 반드시 정확히 하나의 문자를 포함해야 합니다. 그렇지 않으면 Kotlin 컴파일러가 오류를 보고합니다.

```kotlin
val invalid = 'AB' // 오류
val invalidEmpty = '' // 오류
```
{validate="false"}

### 널 허용 값

널 허용(nullable) 값을 저장하려면 `Char?`를 사용하세요.

```kotlin
val maybeAbsent: Char? = null
```

> JVM에서 널 허용 `Char` 값은 필요할 때 박싱됩니다. 이는 [숫자 타입](numbers.md#boxing-and-caching-numbers-on-the-jvm)에도 동일하게 적용됩니다.
>
{style="note"}

## 유니코드 지원

Kotlin은 `Char` 값을 UTF-16 코드 단위로 표현합니다. 이는 단일 `Char`가 반드시 하나의 완전한 유니코드 문자가 아닌, 하나의 UTF-16 코드 단위를 저장함을 의미합니다.

### 기본 다국어 평면

단일 `Char`는 `\u0000`에서 `\uFFFF` 범위의 값을 저장할 수 있습니다. 이 범위는 거의 모든 현대 언어의 문자와 수많은 기호를 포함하는 기본 다국어 평면(Basic Multilingual Plane, BMP)을 다룹니다.

유니코드 값으로 문자를 지정하려면 `\u` 뒤에 [유니코드 표](https://www.unicode.org/charts/)의 4자리 16진수 값을 사용하세요.

```kotlin
val unicodeNumber = '\u0031' // '1'과 같음
```

### 보충 문자

이모지나 일부 역사적 문자와 같은 BMP 외부의 유니코드 문자는 단일 `Char`로 표현할 수 없습니다. UTF-16에서 이러한 문자는 _서로게이트 쌍(surrogate pair)_으로 인코딩되며, 두 개의 `Char` 값이 합쳐져 `String` 내에서 하나의 유니코드 문자를 나타냅니다.

```kotlin
fun main() {
//sampleStart
    val emoji = "🥦"
    
    println(emoji.length) // 2
    println(emoji[0])     // 첫 번째 서로게이트
    println(emoji[1])     // 두 번째 서로게이트
//sampleEnd
}
```

> 32비트 기호를 개별적으로 처리하려면 `Int` 값으로 저장된 유니코드 코드 포인트를 사용하세요.
>
{style="tip"}

## 이스케이프 시퀀스

소스 코드에 직접 쓰기 어렵거나 특별한 의미를 가진 특수 문자에는 이스케이프 시퀀스를 사용하세요.

모든 이스케이프 시퀀스는 백슬래시(`\`)로 시작합니다.

| **지원되는 시퀀스** | **설명**               | 
|------------------------|-----------------------|
| `\t`                   | 탭                    | 
| `\b`                   | 백스페이스             | 
| `
`                   | 새 줄 (LF)            | 
| `\r`                   | 캐리지 리턴 (CR)       | 
| `\'`                   | 작은따옴표             | 
| `\"`                   | 큰따옴표               |
| `\\`                   | 백슬래시               | 
| `\$`                   | 달러 기호              | 

예시:

```kotlin
val newLine = '
'
val dollar = '\$'
val backslash = '\\'
```

## 연산

`Char`는 비교, 검사, 대소문자 변환 및 명시적 숫자 변환을 지원합니다.

### 문자 비교

`Char` 값을 비교하려면 `==`, `!=`, `<`, `>`, `<=`, `>=`와 같은 표준 [비교 연산자](keyword-reference.md#operators-and-special-symbols)를 사용하세요.

Kotlin은 `Char` 값을 해당 유니코드 숫자 값으로 비교하고 `Boolean` 값을 반환합니다.

```kotlin
val before = 'a' < 'b' // true
val after = 'c' > 'd' // false
val different = 'A' == 'a' // false 
val equal = 'A' == 'A' // true
```

### 문자 처리

Kotlin은 문자 값의 검사 및 대소문자 변환을 위한 함수를 제공합니다.
예를 들어:

```kotlin
fun main() {
//sampleStart
    val myChar = 'A'
    // 문자가 숫자인지 확인합니다
    println(myChar.isDigit()) // false
    // 문자가 대문자인지 확인합니다
    println(myChar.isUpperCase()) // true
    // 소문자 버전을 반환합니다
    println(myChar.lowercaseChar()) // 'a'
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 사용 가능한 함수에 대한 자세한 내용은 [API Reference](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-char/)에서 확인하세요.
>
{style="note"}

### 문자 산술 연산

정수를 더하거나 빼서 다른 문자 값을 생성할 수 있습니다.

```kotlin
fun main() {
//sampleStart
    val a = 'a'

    println(a + 1)  // b
    println(a + 2)  // c
    println(a - 32) // A
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 이러한 연산은 언어별 알파벳 규칙이 아닌 유니코드 값을 따릅니다.
>
{style="note"}

가변(mutable) 변수와 함께 전위 및 후위 형태의 증가(`++`) 및 감소(`--`) 연산자를 사용할 수도 있습니다.

```kotlin
fun main() {
//sampleStart
    var a = 'A'
    
    a += 10
    println(a)   // 'K'
    
    println(++a) // 'L'  전위 증가
    println(a++) // 'L'  후위 증가
    println(a)   // 'M'
    
    println(--a) // 'L'  전위 감소
    println(a--) // 'L'  후위 감소
    println(a)   // 'K'
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 문자 변환

`Char`를 숫자 타입으로 변환하려면 명시적 변환을 사용하세요.

* `.code`를 사용하여 문자의 유니코드 숫자 값을 얻으세요.

  ```kotlin
  fun main() { 
  //sampleStart
      val letter = 'A'
      println(letter.code) // 65
  //sampleEnd
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

* 문자가 10진수 숫자를 나타내는 경우 `digitToInt()`를 사용하세요.
  ```kotlin
  fun main() { 
  //sampleStart
      val digit = '7'
      println(digit.digitToInt()) // 7
  //sampleEnd
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

  > 문자가 유효한 숫자가 아닐 수도 있는 경우 `digitToIntOrNull()`을 사용하세요.
  >
  {style="tip"}