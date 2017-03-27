FROM mongo:3.4.2
LABEL maintainer "yigitcan@hotmail.com.tr"

ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /usr/bin/wait-for-it
RUN chmod +x /usr/bin/wait-for-it

# Add initial backup tar to dump folder for auto-import.
ADD ./dumps/initial.tar /dump
ADD ./entrypoint.sh /usr/bin/entrypoint.sh
RUN chmod +x /usr/bin/entrypoint.sh

CMD ["/usr/bin/entrypoint.sh"]
