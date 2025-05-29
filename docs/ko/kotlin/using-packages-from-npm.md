[//]: # (title: npm 종속성 사용)

Kotlin/JS 프로젝트에서는 모든 종속성을 Gradle 플러그인을 통해 관리할 수 있습니다. 여기에는 `kotlinx.coroutines`, `kotlinx.serialization` 또는 `ktor-client`와 같은 Kotlin/멀티플랫폼 라이브러리가 포함됩니다.

[npm](https://www.npmjs.com/)의 JavaScript 패키지에 의존하기 위해, Gradle DSL은 `npm` 함수를 노출하여 npm에서 가져오고 싶은 패키지를 지정할 수 있게 해줍니다. [`is-sorted`](https://www.npmjs.com/package/is-sorted)라는 NPM 패키지 가져오기를 살펴보겠습니다.

Gradle 빌드 파일의 해당 부분은 다음과 같습니다.

```kotlin
dependencies {
    // ...
    implementation(npm("is-sorted", "1.0.5"))
}
```

JavaScript 모듈은 일반적으로 동적 타입이며 Kotlin은 정적 타입 언어이므로, 일종의 어댑터를 제공해야 합니다. Kotlin에서는 이러한 어댑터를 _외부 선언_ (external declarations)이라고 부릅니다. 단 하나의 함수만 제공하는 `is-sorted` 패키지의 경우, 이 선언은 작성하기 쉽습니다. 소스 폴더 내에 `is-sorted.kt`라는 새 파일을 생성하고 다음 내용을 채웁니다.

```kotlin
@JsModule("is-sorted")
@JsNonModule
external fun <T> sorted(a: Array<T>): Boolean
```

CommonJS를 타겟으로 사용하는 경우 `@JsModule` 및 `@JsNonModule` 어노테이션이 그에 따라 조정되어야 한다는 점에 유의하십시오.

이제 이 JavaScript 함수는 일반적인 Kotlin 함수처럼 사용될 수 있습니다. 헤더 파일에 타입 정보를 제공했기 때문에 (단순히 파라미터와 반환 타입을 `dynamic`으로 정의하는 것과 달리) 적절한 컴파일러 지원 및 타입 검사도 가능합니다.

```kotlin
console.log("Hello, Kotlin/JS!")
console.log(sorted(arrayOf(1,2,3)))
console.log(sorted(arrayOf(3,1,2)))
```

이 세 줄을 브라우저 또는 Node.js에서 실행하면, 출력은 `sorted` 호출이 `is-sorted` 패키지에 의해 내보내진 함수에 적절하게 매핑되었음을 보여줍니다.

```kotlin
Hello, Kotlin/JS!
true
false
```

JavaScript 생태계는 패키지 내에서 함수를 노출하는 여러 가지 방법이 있기 때문에 (예를 들어, 이름이 지정된 내보내기 또는 기본 내보내기(default exports)를 통해) 다른 npm 패키지는 외부 선언을 위해 약간 변경된 구조가 필요할 수 있습니다.

선언 작성 방법에 대해 자세히 알아보려면 [Kotlin에서 JavaScript 호출하기](js-interop.md)를 참조하십시오.