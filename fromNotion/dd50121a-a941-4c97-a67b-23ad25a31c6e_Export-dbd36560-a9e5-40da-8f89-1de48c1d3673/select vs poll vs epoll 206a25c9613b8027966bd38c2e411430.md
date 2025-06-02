# select vs poll vs epoll

# 목표

- netty는 epoll을 사용한다. 따라서 epoll 동작을 이해하면 netty를 보다 쉽게 이해할 수 있음
- 여러 I/O 처리 방식을 비교해보며 epoll 이해도 향상.

# Select

- 유저 프로그램이 파일 디스크럽터 별로 관심있는 이벤트를 집합에 등록
- **유저 프로그램**이 집합 내 **fd내 이벤트 발생** 여부를 계속 **체크**
- 발생한 이벤트를 처리
- 시간 복잡도 O(N) [N=등록한 이벤트 수]

```kotlin
#include <stdio.h>
#include <stdlib.h>`
#include <unistd.h>
#include <sys/select.h>
#include <fcntl.h>

int main() {
    int fd1 = STDIN_FILENO; // 표준 입력
    int fd2 = open("file2.txt", O_RDONLY); // 다른 파일
    int fd3 = open("file3.txt", O_RDONLY); // 또 다른 파일

    if (fd2 == -1 || fd3 == -1) {
        perror("Failed to open files");
        return 1;
    }

    // select에서 사용할 fd_set 초기화
    fd_set readfds;
    FD_ZERO(&readfds); // fd_set을 초기화
    FD_SET(fd1, &readfds); // fd1을 readfds에 추가
    FD_SET(fd2, &readfds); // fd2를 readfds에 추가
    FD_SET(fd3, &readfds); // fd3을 readfds에 추가

    // select에서 대기할 시간 설정 (예: 5초)
    struct timeval timeout;
    timeout.tv_sec = 5;
    timeout.tv_usec = 0;

    // select 호출. 이벤트 수신 대기
    int ret = select(FD_SETSIZE, &readfds, NULL, NULL, &timeout);

    if (ret == -1) {
        perror("select failed");
        return 1;
    } else if (ret == 0) {
        printf("Timeout occurred! No data available within 5 seconds.\n");
    } else {
        // 어떤 파일 디스크립터에서 읽기 이벤트가 발생했는지 확인
        if (FD_ISSET(fd1, &readfds)) {
        // 이벤트 처리
            printf("Data is available for reading on fd1 (STDIN)\n");
        }
        if (FD_ISSET(fd2, &readfds)) {
            printf("Data is available for reading on fd2 (file2.txt)\n");
        }
        if (FD_ISSET(fd3, &readfds)) {
            printf("Data is available for reading on fd3 (file3.txt)\n");
        }
    }

    // 파일 디스크립터 닫기
    close(fd2);
    close(fd3);

    return 0;
}
```

# Poll

- select 대비 **`(fd,이벤트,수신여부)` 구조체**로 선언.
- 운영체제가 직접 이벤트를 큐에 넣어주는 epoll 대비 성능 떨어짐. 단, poll()의 구조체를 epoll()에서 유사하게 사용
- 시간 복잡도 O(N) [N=등록한 이벤트 수]

```kotlin
#include <stdio.h>
#include <stdlib.h>
#include <poll.h>
#include <unistd.h>
#include <fcntl.h>

int main() {
    // 파일 디스크립터 준비
    struct pollfd fds[2];
    int timeout = 5000; // 5초 대기

    // fd1: 표준 입력
    fds[0].fd = STDIN_FILENO;
    fds[0].events = POLLIN; // 읽기 가능 이벤트 모니터링

    // fd2: 파일 (예: 파일 디스크립터 열기)
    int fd2 = open("example.txt", O_RDONLY);
    if (fd2 == -1) {
        perror("Failed to open file");
        return 1;
    }
    fds[1].fd = fd2;
    fds[1].events = POLLIN; // 읽기 가능 이벤트 모니터링

    // poll 호출
    int ret = poll(fds, 2, timeout);

    if (ret == -1) {
        perror("poll failed");
        return 1;
    } else if (ret == 0) {
        printf("Timeout! No events occurred within 5 seconds.\n");
    } else {
        // 이벤트 확인
        if (fds[0].revents & POLLIN) { // revents = returned events 약자
            printf("Data is available on stdin.\n");
        }
        if (fds[1].revents & POLLIN) {
            printf("Data is available in example.txt.\n");
        }
    }

    // 파일 디스크립터 닫기
    close(fd2);

    return 0;
}
```

# Epoll

- 운영체제가 직접 운영체제 내 이벤트 큐에 이벤트를 등록하고 유저 프로그램은 이벤트 큐만 감시(blocking)함으로써 효율 극대화
- 시간 복잡도:
    - 이벤트 큐: R/B tree. f/d 등록 및 삭제시 O(logn)
    - 이벤트 수집: O(1) 또는 O(M) [M=발생한 이벤트 수)
- 참고
    - netty 실행시
        - Mac OS에서는 kqueue 를 사용하고
        - 리눅스에서는 epoll을 사용함

![ker1.png](select%20vs%20poll%20vs%20epoll%20206a25c9613b8027966bd38c2e411430/ker1.png)

![ker2.png](select%20vs%20poll%20vs%20epoll%20206a25c9613b8027966bd38c2e411430/ker2.png)

![ker3.png](select%20vs%20poll%20vs%20epoll%20206a25c9613b8027966bd38c2e411430/ker3.png)

![ker4.png](select%20vs%20poll%20vs%20epoll%20206a25c9613b8027966bd38c2e411430/ker4.png)

---

```kotlin
#include <stdio.h>
#include <stdlib.h>
#include <sys/epoll.h>
#include <unistd.h>
#include <fcntl.h>

#define MAX_EVENTS 10

int main() {
    int epoll_fd, file_fd, stdin_fd;
    struct epoll_event event, events[MAX_EVENTS];

    // 1. epoll 인스턴스 생성
    epoll_fd = epoll_create1(0);
    if (epoll_fd == -1) {
        perror("epoll_create1 failed");
        exit(EXIT_FAILURE);
    }

    // 2. 표준 입력(STDIN) 파일 디스크립터 등록
    stdin_fd = STDIN_FILENO;
    event.events = EPOLLIN; // 읽기 이벤트
    event.data.fd = stdin_fd;
    if (epoll_ctl(epoll_fd, EPOLL_CTL_ADD, stdin_fd, &event) == -1) {
        perror("epoll_ctl failed for stdin");
        exit(EXIT_FAILURE);
    }

    // 3. 파일 디스크립터 등록
    file_fd = open("example.txt", O_RDONLY);
    if (file_fd == -1) {
        perror("Failed to open file");
        exit(EXIT_FAILURE);
    }
    event.events = EPOLLIN; // 읽기 이벤트
    event.data.fd = file_fd;
    if (epoll_ctl(epoll_fd, EPOLL_CTL_ADD, file_fd, &event) == -1) {
        perror("epoll_ctl failed for file");
        exit(EXIT_FAILURE);
    }

    // 4. 이벤트 대기
    printf("Waiting for events...\n");
    while (1) {
        int n = epoll_wait(epoll_fd, events, MAX_EVENTS, -1);
        if (n == -1) {
            perror("epoll_wait failed");
            exit(EXIT_FAILURE);
        }

        // 5. 이벤트 처리
        for (int i = 0; i < n; i++) {
            if (events[i].data.fd == stdin_fd) {
                printf("Readable event on stdin\n");
                char buffer[256];
                ssize_t count = read(stdin_fd, buffer, sizeof(buffer));
                if (count > 0) {
                    buffer[count] = '\0';
                    printf("Input: %s", buffer);
                }
            } else if (events[i].data.fd == file_fd) {
                printf("Readable event on file\n");
                char buffer[256];
                ssize_t count = read(file_fd, buffer, sizeof(buffer));
                if (count > 0) {
                    buffer[count] = '\0';
                    printf("File content: %s", buffer);
                }
            }
        }
    }

    // 6. 리소스 정리
    close(file_fd);
    close(epoll_fd);

    return 0;
}
```

![Screenshot 2025-06-02 at 6.22.56 pm.png](select%20vs%20poll%20vs%20epoll%20206a25c9613b8027966bd38c2e411430/Screenshot_2025-06-02_at_6.22.56_pm.png)

```
@startuml
skinparam participantStyle rectangle

participant "유저 공간(User Space)" as US
participant "커널 로직(KS)" as KS
participant "epoll 인스턴스(이벤트 큐)" as EI
box "Kernal Space" #LightGray
  participant "커널 로직(KS)" as KS
  participant "epoll 인스턴스(EI)" as EI
end box

US -> KS: epoll_create1() 호출
activate KS
KS -> KS: epoll 인스턴스(EI) 생성
KS --> US: epoll_fd(epoll 파일 디스크립터) 반환
deactivate KS

US -> KS: epoll_ctl(EPOLL_CTL_ADD/MOD/DEL, fd)
activate KS
KS -> EI: fd와 관심 이벤트 등록/수정/삭제
KS --> US: 성공/실패 결과 반환
deactivate KS

US -> KS: epoll_wait(epoll_fd)
activate KS
KS -> EI: 이벤트 발생 여부 확인
EI -> KS: 발생한 이벤트 목록 반환
KS --> US: 이벤트가 발생한 fd 목록 반환(events)
deactivate KS

US -> US: 반환받은 이벤트 처리
@enduml

```