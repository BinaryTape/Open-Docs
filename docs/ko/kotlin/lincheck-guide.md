[//]: # (title: Lincheck 가이드)

Lincheck은 JVM에서 동시성 알고리즘을 테스트하기 위한 실용적이고 사용자 친화적인 프레임워크입니다. 동시성 테스트를 작성하기 위한 단순하고 선언적인 방식을 제공합니다.

Lincheck 프레임워크를 사용하면, 테스트를 수행하는 방법을 설명하는 대신 검사할 모든 연산과 필요한 정확성 속성(correctness property)을 선언하여 _무엇을 테스트할지_ 지정할 수 있습니다. 결과적으로 일반적인 동시성 Lincheck 테스트는 약 15줄 정도의 코드로 작성됩니다.

연산 목록이 주어지면 Lincheck은 자동으로 다음을 수행합니다:

* 무작위 동시성 시나리오 세트를 생성합니다.
* 스트레스 테스트(stress-testing) 또는 바운디드 모델 체킹(bounded model checking)을 사용하여 이를 검사합니다.
* 각 호출 결과가 필요한 정확성 속성을 충족하는지 확인합니다(선형화 가능성(linearizability)이 기본값입니다).

## 프로젝트에 Lincheck 추가하기

Lincheck 지원을 활성화하려면 Gradle 설정에 해당 저장소와 의존성을 추가하세요. `build.gradle(.kts)` 파일에 다음 내용을 추가합니다:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
repositories {
    mavenCentral()
}
 
dependencies {
    testImplementation("org.jetbrains.lincheck:lincheck:%lincheckVersion%")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
repositories {
    mavenCentral()
}

dependencies {
    testImplementation "org.jetbrains.lincheck:lincheck:%lincheckVersion%"
}
```

</tab>
</tabs>

## Lincheck 살펴보기

이 가이드는 프레임워크를 접하고 예제를 통해 가장 유용한 기능을 사용해 볼 수 있도록 도와줍니다. Lincheck 기능을 단계별로 알아보세요:

1. [Lincheck으로 첫 번째 테스트 작성하기](introduction.md)
2. [테스트 전략 선택하기](testing-strategies.md)
3. [연산 인자 설정하기](operation-arguments.md)
4. [일반적인 알고리즘 제약 사항 고려하기](constraints.md)
5. [알고리즘의 논블로킹 진행 보장 확인하기](progress-guarantees.md)
6. [알고리즘의 순차적 명세 정의하기](sequential-specification.md)

## 추가 참고 자료
* Nikita Koval의 "How we test concurrent algorithms in Kotlin Coroutines": [Video](https://youtu.be/jZqkWfa11Js). KotlinConf 2023
* Maria Sokolova의 "Lincheck: Testing concurrency on the JVM" 워크숍: [Part 1](https://www.youtube.com/watch?v=YNtUK9GK4pA), [Part 2](https://www.youtube.com/watch?v=EW7mkAOErWw). Hydra 2021