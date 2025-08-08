[//]: # (title: 첫 번째 Kotlin Notebook 만들기)

<tldr>
   <p>이 문서는 **Kotlin Notebook 시작하기** 튜토리얼의 두 번째 부분입니다. 진행하기 전에 이전 단계를 완료했는지 확인하세요.</p>
   <p><img src="icon-1-done.svg" width="20" alt="첫 번째 단계"/> <a href="kotlin-notebook-set-up-env.md">환경 설정</a><br/>
      <img src="icon-2.svg" width="20" alt="두 번째 단계"/> <strong>Kotlin Notebook 만들기</strong><br/>
      <img src="icon-3-todo.svg" width="20" alt="세 번째 단계"/> Kotlin Notebook에 의존성 추가<br/>
  </p>
</tldr>

여기서는 첫 번째 [Kotlin Notebook](kotlin-notebook-overview.md)을 만들고, 간단한 작업을 수행하며, 코드 셀을 실행하는 방법을 배웁니다. 

## 빈 프로젝트 생성

1.  IntelliJ IDEA에서 **File | New | Project**를 선택합니다.
2.  왼쪽 패널에서 **New Project**를 선택합니다.
3.  새 프로젝트의 이름을 지정하고 필요한 경우 위치를 변경합니다.

   > 새 프로젝트를 버전 제어 하에 두려면 **Create Git repository** 체크박스를 선택하세요. 
   > 이 작업은 나중에 언제든지 수행할 수 있습니다.
   > 
   {style="tip"}

4.  **Language** 목록에서 **Kotlin**을 선택합니다.

   ![새 Kotlin Notebook 프로젝트 생성](new-notebook-project.png){width=700}

5.  **IntelliJ** 빌드 시스템을 선택합니다.
6.  **JDK** 목록에서 프로젝트에서 사용할 [JDK](https://www.oracle.com/java/technologies/downloads/)를 선택합니다.
7.  `"Hello World!"` 샘플 애플리케이션 파일 생성을 위해 **Add sample code** 옵션을 활성화합니다.

   > 샘플 코드에 유용한 추가 주석을 추가하려면 **Generate code with onboarding tips** 옵션을 활성화할 수도 있습니다.
   > 
   {style="tip"}

8.  **Create**를 클릭합니다.

## Kotlin Notebook 만들기

1.  새 노트북을 만들려면 **File | New | Kotlin Notebook**을 선택하거나, 폴더를 마우스 오른쪽 버튼으로 클릭한 후 **New | Kotlin Notebook**을 선택합니다.

   ![새 Kotlin Notebook 생성](new-notebook.png){width=700}

2.  새 노트북의 이름을 지정합니다(예: **first-notebook**). 그리고 **Enter**를 누릅니다.
    Kotlin Notebook **first-notebook.ipynb** 파일이 새 탭에 열립니다.
3.  열린 탭에서 코드 셀에 다음 코드를 입력합니다:

   ```kotlin
   println("Hello, this is a Kotlin Notebook!")
   ```
4.  코드 셀을 실행하려면 **Run Cell and Select Below** ![셀을 실행하고 아래 선택](run-cell-and-select-below.png){width=30}{type="joined"} 버튼을 클릭하거나 **Shift** + **Return**을 누릅니다.
5.  **Add Markdown Cell** 버튼을 클릭하여 마크다운 셀을 추가합니다.
6.  셀에 `# Example operations`를 입력하고, 코드 셀을 실행하는 것과 동일한 방식으로 실행하여 렌더링합니다.
7.  새 코드 셀에 `10 + 10`을 입력하고 실행합니다.
8.  코드 셀에서 변수를 정의합니다. 예를 들어, `val a = 100`. 

   > 정의된 변수가 포함된 코드 셀을 실행하면 해당 변수는 다른 모든 코드 셀에서 접근할 수 있습니다.
   > 
   {style="tip"}

9.  새 코드 셀을 만들고 `println(a * a)`를 추가합니다.
10. **Run All** ![모두 실행 버튼](run-all-button.png){width=30}{type="joined"} 버튼을 사용하여 노트북의 모든 코드 및 마크다운 셀을 실행합니다.

    ![첫 번째 노트북](first-notebook.png){width=700}

축하합니다! 첫 번째 Kotlin Notebook을 성공적으로 만들었습니다.

## 스크래치 Kotlin Notebook 만들기

IntelliJ IDEA 2024.1.1부터 Kotlin Notebook을 스크래치 파일로도 만들 수 있습니다.

[스크래치 파일](https://www.jetbrains.com/help/idea/scratches.html#create-scratch-file)을 사용하면 새 프로젝트를 만들거나 기존 프로젝트를 수정하지 않고도 작은 코드 조각을 테스트할 수 있습니다.

스크래치 Kotlin Notebook을 만들려면:

1.  **File | New | Scratch File**을 클릭합니다.
2.  **New Scratch File** 목록에서 **Kotlin Notebook**을 선택합니다.

   ![스크래치 노트북](kotlin-notebook-scratch-file.png){width=400}

## 다음 단계

튜토리얼의 다음 부분에서는 Kotlin Notebook에 의존성을 추가하는 방법을 배웁니다.

**[다음 챕터로 진행](kotlin-notebook-add-dependencies.md)**