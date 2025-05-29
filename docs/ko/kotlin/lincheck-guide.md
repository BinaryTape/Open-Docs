[//]: # (title: Lincheck 가이드)

Lincheck는 JVM에서 동시성 알고리즘을 테스트하기 위한 실용적이고 사용자 친화적인 프레임워크입니다. 이 프레임워크는 동시성 테스트를 작성하는 간단하고 선언적인 방법을 제공합니다.

Lincheck 프레임워크를 사용하면 테스트를 수행하는 방법을 설명하는 대신, 검사할 모든 연산과 필요한 정확성 속성을 선언함으로써 _무엇을 테스트할지_ 지정할 수 있습니다. 그 결과, 일반적인 Lincheck 동시성 테스트는 약 15줄 정도에 불과합니다.

연산 목록이 주어지면 Lincheck는 자동으로 다음을 수행합니다:

*   무작위 동시성 시나리오 세트를 생성합니다.
*   부하 테스트(stress-testing) 또는 유한 모델 검증(bounded model checking) 중 하나를 사용하여 이를 검사합니다.
*   각 호출 결과가 필요한 정확성 속성(기본값은 선형성(linearizability)입니다)을 만족하는지 검증합니다.

## 프로젝트에 Lincheck 추가하기

Lincheck 지원을 활성화하려면 해당 저장소와 의존성을 Gradle 설정에 포함하세요. `build.gradle(.kts)` 파일에 다음을 추가합니다:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
repositories {
    mavenCentral()
}
 
dependencies {
    testImplementation("org.jetbrains.kotlinx:lincheck:%lincheckVersion%")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
repositories {
    mavenCentral()
}

dependencies {
    testImplementation "org.jetbrains.kotlinx:lincheck:%lincheckVersion%"
}
```

</tab>
</tabs>

## Lincheck 살펴보기

이 가이드는 프레임워크를 접하고 가장 유용한 기능을 예제와 함께 시도하는 데 도움이 될 것입니다. Lincheck 기능을 단계별로 배우세요:

1.  [Lincheck로 첫 테스트 작성하기](introduction.md)
2.  [테스트 전략 선택하기](testing-strategies.md)
3.  [연산 인자 구성하기](operation-arguments.md)
4.  [주요 알고리즘 제약 조건 고려하기](constraints.md)
5.  [알고리즘의 논블로킹 진행 보장 확인하기](progress-guarantees.md)
6.  [알고리즘의 순차 사양 정의하기](sequential-specification.md)

## 추가 참조 자료
*   Nikita Koval의 "Kotlin 코루틴에서 동시성 알고리즘을 테스트하는 방법": [비디오](https://youtu.be/jZqkWfa11Js). KotlinConf 2023
*   Maria Sokolova의 "Lincheck: JVM에서 동시성 테스트하기" 워크숍: [파트 1](https://www.youtube.com/watch?v=YNtUK9GK4pA), [파트 2](https://www.youtube.com/watch?v=EW7mkAOErWw). Hydra 2021