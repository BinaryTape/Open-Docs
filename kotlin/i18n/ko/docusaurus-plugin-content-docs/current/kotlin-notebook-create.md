---
title: "첫 번째 Kotlin Notebook 만들기"
---
:::info
<p>
   이 튜토리얼은 <strong>Kotlin Notebook 시작하기</strong>의 두 번째 파트입니다. 계속하기 전에 이전 단계를 완료했는지 확인하세요.
</p>
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step"/> <a href="kotlin-notebook-set-up-env">환경 설정</a><br/>
      <img src="/img/icon-2.svg" width="20" alt="Second step"/> <strong>Kotlin Notebook 생성</strong><br/>
      <img src="/img/icon-3-todo.svg" width="20" alt="Third step"/> Kotlin Notebook에 종속성 추가<br/>
</p>

:::

여기서는 첫 번째 [Kotlin Notebook](kotlin-notebook-overview)을 만들고, 간단한 연산을 수행하고, 코드 셀을 실행하는 방법을 배웁니다.

## 빈 프로젝트 생성

1. IntelliJ IDEA에서 **File | New | Project**를 선택합니다.
2. 왼쪽 패널에서 **New Project**를 선택합니다.
3. 새 프로젝트의 이름을 지정하고 필요한 경우 위치를 변경합니다.

   > 새 프로젝트를 버전 관리하에 두려면 **Create Git repository** 확인란을 선택합니다.
   > 언제든지 나중에 수행할 수 있습니다.
   > 
   

4. **Language** 목록에서 **Kotlin**을 선택합니다.

   <img src="/img/new-notebook-project.png" alt="Create a new Kotlin Notebook project" width="700" style={{verticalAlign: 'middle'}}/>

5. **IntelliJ** 빌드 시스템을 선택합니다.
6. **JDK list**에서 프로젝트에서 사용할 [JDK](https://www.oracle.com/java/technologies/downloads/)를 선택합니다.
7. 샘플 `"Hello World!"` 애플리케이션이 있는 파일을 만들려면 **Add sample code** 옵션을 활성화합니다.

   > 샘플 코드에 유용한 주석을 추가하려면 **Generate code with onboarding tips** 옵션을 활성화할 수도 있습니다.
   > 
   

8. **Create**를 클릭합니다.

## Kotlin Notebook 생성

1. 새 노트북을 만들려면 **File | New | Kotlin Notebook**을 선택하거나 폴더를 마우스 오른쪽 버튼으로 클릭하고 **New | Kotlin Notebook**을 선택합니다.

   <img src="/img/new-notebook.png" alt="Create a new Kotlin Notebook" width="700" style={{verticalAlign: 'middle'}}/>

2. 새 노트북의 이름을 설정합니다(예: **first-notebook**)하고 **Enter** 키를 누릅니다.
   Kotlin Notebook **first-notebook.ipynb**가 있는 새 탭이 열립니다.
3. 열린 탭에서 코드 셀에 다음 코드를 입력합니다.

   ```kotlin
   println("Hello, this is a Kotlin Notebook!")
   ```
4. 코드 셀을 실행하려면 **Run Cell and Select Below** <img src="/img/run-cell-and-select-below.png" alt="Run Cell and Select Below" width="30" style={{verticalAlign: 'middle'}}/> 버튼을 클릭하거나 **Shift** + **Return** 키를 누릅니다.
5. **Add Markdown Cell** 버튼을 클릭하여 마크다운 셀을 추가합니다.
6. 셀에 `# Example operations`를 입력하고 코드 셀을 실행하는 것과 같은 방식으로 실행하여 렌더링합니다.
7. 새 코드 셀에 `10 + 10`을 입력하고 실행합니다.
8. 코드 셀에 변수를 정의합니다. 예를 들어 `val a = 100`입니다.

   > 정의된 변수가 있는 코드 셀을 실행하면 해당 변수는 다른 모든 코드 셀에서 액세스할 수 있습니다.
   > 
   

9. 새 코드 셀을 만들고 `println(a * a)`를 추가합니다.
10. **Run All** <img src="/img/run-all-button.png" alt="Run all button" width="30" style={{verticalAlign: 'middle'}}/> 버튼을 사용하여 노트북의 모든 코드 및 마크다운 셀을 실행합니다.

    <img src="/img/first-notebook.png" alt="First notebook" width="700" style={{verticalAlign: 'middle'}}/>

축하합니다! 첫 번째 Kotlin Notebook을 만들었습니다.

## 스크래치 Kotlin Notebook 생성

IntelliJ IDEA 2024.1.1부터 Kotlin Notebook을 스크래치 파일로 만들 수도 있습니다.

[스크래치 파일](https://www.jetbrains.com/help/idea/scratches.html#create-scratch-file)을 사용하면 새 프로젝트를 만들거나 기존 프로젝트를 수정하지 않고도 작은 코드 조각을 테스트할 수 있습니다.

스크래치 Kotlin Notebook을 만들려면:

1. **File | New | Scratch File**을 클릭합니다.
2. **New Scratch File** 목록에서 **Kotlin Notebook**을 선택합니다.

   <img src="/img/kotlin-notebook-scratch-file.png" alt="Scratch notebook" width="400" style={{verticalAlign: 'middle'}}/>

## 다음 단계

튜토리얼의 다음 파트에서는 Kotlin Notebook에 종속성을 추가하는 방법을 배웁니다.

**[다음 장으로 진행](kotlin-notebook-add-dependencies)**