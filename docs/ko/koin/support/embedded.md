---
title: Koin Embedded
custom_edit_url: null
---

Koin Embedded는 Android/Kotlin SDK 및 라이브러리 개발자를 대상으로 하는 새로운 Koin 프로젝트입니다.

이 프로젝트는 Koin 프로젝트를 다른 패키지 이름으로 다시 빌드하고 패키징할 수 있도록 돕는 스크립트를 제공합니다. 이는 SDK 및 라이브러리 개발 시, 내장된(embedded) Koin 버전과 해당 라이브러리를 사용하는 애플리케이션에서 사용하는 다른 Koin 버전 간에 발생할 수 있는 충돌을 방지하기 위함입니다.

피드백이나 도움이 필요하신가요? [Koin 팀](mailto:koin@kotzilla.io)에 문의하세요.

:::info
이 이니셔티브는 현재 베타(Beta) 버전이며, 여러분의 피드백을 기다리고 있습니다.
:::

## 임베디드 버전 (Beta)

Koin 임베디드 버전의 예시는 다음과 같습니다: [Kotzilla 저장소](https://repository.kotzilla.io/#browse/browse:Koin-Embedded)
- 사용 가능한 패키지: `embedded-koin-core`, `embedded-koin-android`
- `org.koin.*`에서 `embedded.koin.*`으로 패키지 재배치(Relocation)

Gradle 설정에 다음 Maven 저장소를 추가하세요:
```kotlin
maven { 'https://repository.kotzilla.io/repository/kotzilla-platform/' }
```

## 재배치 스크립트 (Beta)

다음은 지정된 패키지 이름으로 Koin을 다시 빌드하여, 이를 내장하고 일반적인 Koin 프레임워크 사용과의 충돌을 피할 수 있도록 돕는 스크립트들입니다.

자세한 내용은 Koin [재배치 스크립트(relocation scripts)](https://github.com/InsertKoinIO/koin-embedded?tab=readme-ov-file#koin-relocation-scripts) 프로젝트를 참조하세요.