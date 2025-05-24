---
title: "npm에서 종속성 사용"
---
Kotlin/JS 프로젝트에서 모든 종속성은 Gradle 플러그인을 통해 관리할 수 있습니다. 여기에는 `kotlinx.coroutines`, `kotlinx.serialization` 또는 `ktor-client`와 같은 Kotlin/Multiplatform 라이브러리가 포함됩니다.

[npm](https://www.npmjs.com/)의 JavaScript 패키지에 의존하기 위해 Gradle DSL은 npm에서 가져올 패키지를 지정할 수 있는 `npm` 함수를 제공합니다. [`is-sorted`](https://www.npmjs.com/package/is-sorted)라는 NPM 패키지를 가져오는 것을 고려해 보겠습니다.

Gradle 빌드 파일의 해당 부분은 다음과 같습니다.

```kotlin
dependencies {
    // ...
    implementation(npm("is-sorted", "1.0.5"))
}
```

JavaScript 모듈은 일반적으로 동적으로 타입이 지정되고 Kotlin은 정적으로 타입이 지정된 언어이므로 일종의 어댑터를 제공해야 합니다. Kotlin에서 이러한 어댑터를 _외부 선언_이라고 합니다. 소스 폴더 내부에 `is-sorted.kt`라는 새 파일을 만들고 다음 내용으로 채웁니다.

```kotlin
@JsModule("is-sorted")
@JsNonModule
external fun <T> sorted(a: Array<T>): Boolean
```

CommonJS를 대상으로 사용하는 경우 `@JsModule` 및 `@JsNonModule` 어노테이션을 적절하게 조정해야 합니다.

이제 이 JavaScript 함수를 일반 Kotlin 함수처럼 사용할 수 있습니다. 헤더 파일에 타입 정보를 제공했기 때문에 (단순히 파라미터 및 반환 타입을 `dynamic`으로 정의하는 것과 반대로) 적절한 컴파일러 지원 및 타입 검사도 사용할 수 있습니다.

```kotlin
console.log("Hello, Kotlin/JS!")
console.log(sorted(arrayOf(1,2,3)))
console.log(sorted(arrayOf(3,1,2)))
```

브라우저 또는 Node.js에서 이 세 줄을 실행하면 `sorted` 호출이 `is-sorted` 패키지에서 내보낸 함수에 올바르게 매핑되었음을 출력에서 ​​알 수 있습니다.

```kotlin
Hello, Kotlin/JS!
true
false
```

JavaScript 생태계에는 패키지에서 함수를 노출하는 여러 가지 방법(예: 명명된 또는 기본 내보내기를 통해)이 있기 때문에 다른 npm 패키지는 외부 선언에 대해 약간 변경된 구조가 필요할 수 있습니다.

선언 작성 방법에 대한 자세한 내용은 [Kotlin에서 JavaScript 호출하기](js-interop)를 참조하십시오.